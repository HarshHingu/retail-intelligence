import { NextResponse } from "next/server";
import { getCustomerSegments } from "@/services/dashboardService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const segments = await getCustomerSegments();
    return NextResponse.json(segments);
  } catch (error: any) {
    console.error("Error in GET /api/segments:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
