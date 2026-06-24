import { NextResponse } from "next/server";
import { generateAndCacheInsight } from "@/services/aiService";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const newInsight = await generateAndCacheInsight();
    return NextResponse.json(newInsight);
  } catch (error: any) {
    console.error("Error in POST /api/insights/generate:", error);
    return NextResponse.json(
      { error: "Failed to generate AI insights", details: error.message },
      { status: 500 }
    );
  }
}
