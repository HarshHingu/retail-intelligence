import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from "@/lib/mongodb";
import Customer from "@/models/Customer";
import Product from "@/models/Product";
import Campaign from "@/models/Campaign";
import { getDashboardStats, getChartsData } from "@/services/dashboardService";

const GOOGLE_GENERATIVE_AI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(GOOGLE_GENERATIVE_AI_API_KEY || "");

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (!GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { error: "Google Generative AI Key is not configured." },
        { status: 500 }
      );
    }

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid messages array provided." },
        { status: 400 }
      );
    }

    await dbConnect();

    // 1. Gather summary data for AI context in parallel
    const [stats, charts, productCount, activeCampaignCount, bottomCustomers, segmentDistribution] = await Promise.all([
      getDashboardStats(),
      getChartsData(),
      Product.countDocuments(),
      Campaign.countDocuments({ status: "active" }),
      Customer.find({}, { name: 1, totalSpend: 1, totalOrders: 1, segment: 1 })
        .sort({ totalSpend: 1 })
        .limit(5)
        .lean(),
      Customer.aggregate([
        { $group: { _id: "$segment", count: { $sum: 1 } } }
      ])
    ]);

    const segmentCounts = segmentDistribution.reduce((acc: any, curr: any) => {
      if (curr._id) acc[curr._id] = curr.count;
      return acc;
    }, {});

    // Format metrics context
    const storeContext = `
[RETAIL STORE CONTEXT METRICS]
Total Revenue: ₹${stats.totalRevenue}
Total Customers: ${stats.totalCustomers}
Total Orders/Transactions: ${stats.totalTransactions}
Average Order Value: ₹${stats.averageOrderValue}
Repeat Purchase Rate: ${stats.repeatPurchaseRate}%
Total Products Seeded: ${productCount}
Active Campaigns: ${activeCampaignCount}

CUSTOMER SEGMENTS COUNT:
- VIP: ${segmentCounts["VIP"] || 0}
- Loyal: ${segmentCounts["Loyal"] || 0}
- New: ${segmentCounts["New"] || 0}
- At Risk: ${segmentCounts["At Risk"] || 0}
- Dormant: ${segmentCounts["Dormant"] || 0}

TOP SPENDERS (Highest Value):
${JSON.stringify(charts.topCustomers.map((c) => ({ name: c.name, spend: c.totalSpend, segment: c.segment })))}

BOTTOM SPENDERS (Lowest Value):
${JSON.stringify(bottomCustomers.map((c) => ({ name: c.name, spend: c.totalSpend, segment: c.segment })))}

STORE CATEGORIES DISTRIBUTION:
${JSON.stringify(charts.categoryDistribution)}

PAYMENT METHODS DISTRIBUTION:
${JSON.stringify(charts.paymentMethods)}
`;

    const systemInstruction = `You are RetailGPT, an expert retail growth strategist helping store owners increase retention, loyalty and revenue.
You have access to the store's high-level business summary metrics.
Responses must be:
- Business-focused
- Actionable
- Short and concise
- Data-driven (using the metrics provided)

Store metrics available to you:
${storeContext}

Do NOT output raw markdown code blocks unless requested. Limit responses to 2-3 short, highly impactful paragraphs or bullet points.`;

    // 2. Prepare Gemini Model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction,
    });

    // 3. Map conversation history (ensure history starts with a 'user' message to comply with Gemini rules)
    const firstUserIndex = messages.findIndex((m: any) => m.role === "user");
    const activeMessages = firstUserIndex !== -1 ? messages.slice(firstUserIndex) : messages;

    // Slice all but the last message, limiting context history to the last 6 messages
    const historyWindow = activeMessages.slice(0, -1).slice(-6);
    const formattedHistory = historyWindow.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const latestMessage = activeMessages[activeMessages.length - 1];

    // Initialize chat
    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(latestMessage.content);
    const replyText = result.response.text();

    return NextResponse.json({ role: "assistant", content: replyText });
  } catch (error: any) {
    console.error("Error in POST /api/copilot:", error);
    return NextResponse.json(
      { error: "Failed to generate copilot reply", details: error.message },
      { status: 500 }
    );
  }
}
