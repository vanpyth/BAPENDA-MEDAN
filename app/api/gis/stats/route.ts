import { NextResponse } from "next/server";
import { GISService } from "@/lib/services/gis";

export async function GET() {
  try {
    const result = await GISService.getComplianceStats();
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("[GIS_STATS_API_ERROR]", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
