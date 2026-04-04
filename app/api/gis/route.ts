import { NextResponse } from "next/server";
import { GISService } from "@/lib/services/gis";

export async function GET() {
  try {
    const { success, data, error } = await GISService.getTaxObjectCoordinates();
    
    if (!success) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("[GIS_API_ERROR]", error);
    return NextResponse.json({ error: "GIS process failed" }, { status: 500 });
  }
}
