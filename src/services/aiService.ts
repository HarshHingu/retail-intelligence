import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from "@/lib/mongodb";
import Customer from "@/models/Customer";
import AIInsight from "@/models/AIInsight";
import Campaign from "@/models/Campaign";
import { getDashboardStats, getChartsData } from "./dashboardService";

const GOOGLE_GENERATIVE_AI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

const genAI = new GoogleGenerativeAI(GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function getLatestInsight() {
  await dbConnect();
  const insight = await AIInsight.findOne().sort({ generatedAt: -1 }).lean();
  if (!insight) return null;
  return {
    _id: insight._id.toString(),
    summary: insight.summary,
    recommendations: insight.recommendations,
    churnRiskCustomers: insight.churnRiskCustomers,
    generatedAt: insight.generatedAt.toISOString(),
  };
}

export async function generateAndCacheInsight() {
  if (!GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not defined in the environment.");
  }

  await dbConnect();

  // 1. Gather high-level metrics
  const stats = await getDashboardStats();
  const charts = await getChartsData();
  const atRiskCount = await Customer.countDocuments({ segment: "AtRisk" });

  const metricsSummary = {
    totalRevenue: stats.totalRevenue,
    totalCustomers: stats.totalCustomers,
    totalTransactions: stats.totalTransactions,
    averageOrderValue: stats.averageOrderValue,
    repeatPurchaseRate: stats.repeatPurchaseRate,
    atRiskCustomersCount: atRiskCount,
    categorySales: charts.categoryDistribution,
    topCustomers: charts.topCustomers.map((c) => ({
      name: c.name,
      spend: c.totalSpend,
      segment: c.segment,
    })),
  };

  // 2. Call Gemini
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const systemInstruction = `You are a retail growth consultant.
Analyze the provided retail metrics.
Return a structured JSON object. The response should contain:
1. Executive Summary (under "summary" key)
2. Actionable growth, cross-sell, and churn prevention recommendations (under "recommendations" key as an array of strings)

Keep recommendations concise, data-driven, and highly actionable.
The response must be valid JSON with this exact structure:
{
  "summary": "...",
  "recommendations": ["...", "..."]
}
Return ONLY the raw JSON string, do not wrap in markdown \`\`\`json block.`;

  const prompt = `Here are the retail business metrics:
${JSON.stringify(metricsSummary, null, 2)}

Analyze this data and return the JSON according to the instructions.`;

  const result = await model.generateContent([
    { text: systemInstruction },
    { text: prompt },
  ]);

  const text = result.response.text().trim();
  
  let parsed;
  try {
    // Clean response if LLM added formatting markdown code block
    const cleanText = text.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    parsed = JSON.parse(cleanText);
  } catch (e) {
    console.error("JSON parsing failed for AI response, raw was:", text, e);
    // Fallback if parsing fails
    parsed = {
      summary: `Executive summary generated for revenue of ₹${stats.totalRevenue}. Sales are steady with preferred customer segments representing core growth. Churn risks require active retention.`,
      recommendations: [
        `Re-engage the ${atRiskCount} at-risk customers with customized offers.`,
        "Promote high-margin products in top selling categories.",
        "Create high-value product bundles to increase the Average Order Value of ₹" + Math.round(stats.averageOrderValue) + ".",
      ],
    };
  }

  // 3. Cache in MongoDB
  const newInsight = new AIInsight({
    summary: parsed.summary,
    recommendations: parsed.recommendations,
    churnRiskCustomers: atRiskCount,
    generatedAt: new Date(),
  });

  await newInsight.save();

  return {
    _id: newInsight._id.toString(),
    summary: newInsight.summary,
    recommendations: newInsight.recommendations,
    churnRiskCustomers: newInsight.churnRiskCustomers,
    generatedAt: newInsight.generatedAt.toISOString(),
  };
}

export async function generateCampaignAI(targetSegment: string, goal: string) {
  if (!GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not defined in the environment.");
  }

  await dbConnect();

  // 1. Get segment intelligence
  const customerCount = await Customer.countDocuments({ segment: targetSegment });
  const segmentStats = await Customer.aggregate([
    { $match: { segment: targetSegment } },
    {
      $group: {
        _id: null,
        avgSpend: { $avg: "$totalSpend" },
        avgOrders: { $avg: "$totalOrders" },
      },
    },
  ]);

  const avgSpend = segmentStats[0]?.avgSpend || 0;
  const avgOrders = segmentStats[0]?.avgOrders || 0;

  // 2. Call Gemini
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const systemInstruction = `You are an expert retail marketing strategist.
Create a promotional campaign targeting a specific customer segment to achieve a business goal.
Return a structured JSON response containing:
1. Campaign Name (under "name" key)
2. Offer details (under "offer" key)
3. WhatsApp message body copy, max 300 characters, using friendly emojis (under "whatsappMessage" key)
4. Push notification text, max 100 characters, urgent & compelling (under "pushMessage" key)
5. Expected business impact, short and data-backed (under "expectedImpact" key)

The response must be valid JSON with this exact structure:
{
  "name": "...",
  "offer": "...",
  "whatsappMessage": "...",
  "pushMessage": "...",
  "expectedImpact": "..."
}
Return ONLY the raw JSON string. Do not wrap in markdown \`\`\`json block.`;

  const prompt = `Create a campaign for:
Target Segment: ${targetSegment} (Total customers: ${customerCount}, Avg Segment Spend: ₹${Math.round(avgSpend)}, Avg Orders: ${Math.round(avgOrders * 10) / 10})
Campaign Goal: ${goal}

Generate a hyper-targeted, creative, and high-converting marketing strategy.`;

  const result = await model.generateContent([
    { text: systemInstruction },
    { text: prompt },
  ]);

  const text = result.response.text().trim();
  
  let parsed;
  try {
    const cleanText = text.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    parsed = JSON.parse(cleanText);
  } catch (e) {
    console.error("JSON parsing failed for Campaign AI response:", text, e);
    parsed = {
      name: `${targetSegment} Loyalty Booster Campaign`,
      offer: `Special Promotion: ₹500 Cashback`,
      whatsappMessage: `Hey there! We appreciate your loyalty. Enjoy ₹500 cashback on your next purchase above ₹2999. Use code RET500 at checkout!`,
      pushMessage: `₹500 Cashback code inside! Exclusive reward for your support.`,
      expectedImpact: `Expected to boost repeat order frequency by 10-15% over the next 14 days.`,
    };
  }

  // 3. Save to MongoDB
  const newCampaign = new Campaign({
    name: parsed.name,
    targetSegment: targetSegment,
    channel: "Multichannel",
    offer: parsed.offer,
    message: `WhatsApp: ${parsed.whatsappMessage}\n\nPush: ${parsed.pushMessage}`,
    whatsappMessage: parsed.whatsappMessage,
    pushMessage: parsed.pushMessage,
    expectedImpact: parsed.expectedImpact,
    goal: goal,
    status: "active",
  });

  await newCampaign.save();

  return {
    _id: newCampaign._id.toString(),
    name: newCampaign.name,
    targetSegment: newCampaign.targetSegment,
    channel: newCampaign.channel,
    offer: newCampaign.offer,
    message: newCampaign.message,
    whatsappMessage: newCampaign.whatsappMessage,
    pushMessage: newCampaign.pushMessage,
    expectedImpact: newCampaign.expectedImpact,
    goal: newCampaign.goal,
    status: newCampaign.status,
    createdAt: newCampaign.createdAt ? newCampaign.createdAt.toISOString() : undefined,
  };
}
