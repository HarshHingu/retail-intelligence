import { NextResponse } from "next/server";
import { getCampaignsList } from "@/services/dashboardService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const campaigns = await getCampaignsList();
    return NextResponse.json(campaigns);
  } catch (error: any) {
    console.error("Error in GET /api/campaigns:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
