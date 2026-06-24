import { NextResponse } from "next/server";
import { generateCampaignAI } from "@/services/aiService";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { targetSegment, goal } = await request.json();

    if (!targetSegment || !goal) {
      return NextResponse.json(
        { error: "Both targetSegment and goal are required." },
        { status: 400 }
      );
    }

    const campaign = await generateCampaignAI(targetSegment, goal);
    return NextResponse.json(campaign);
  } catch (error: any) {
    console.error("Error in POST /api/campaigns/generate:", error);
    return NextResponse.json(
      { error: "Failed to generate campaign", details: error.message },
      { status: 500 }
    );
  }
}
