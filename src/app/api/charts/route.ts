import { NextResponse } from "next/server";
import { getChartsData } from "@/services/dashboardService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getChartsData();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in GET /api/charts:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
