import { NextResponse } from "next/server";
import { getLatestInsight } from "@/services/aiService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const latest = await getLatestInsight();
    return NextResponse.json(latest);
  } catch (error: any) {
    console.error("Error in GET /api/insights:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
