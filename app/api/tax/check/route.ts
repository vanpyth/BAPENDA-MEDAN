import { NextRequest, NextResponse } from "next/server";
import { TaxService } from "@/lib/services/tax";

/**
 * GET /api/tax/check?nop=12.71.000.000...
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const nop = searchParams.get("nop");

  if (!nop) {
     return NextResponse.json({ 
       success: false, 
       message: "Nomor Objek Pajak (NOP) harus diisi." 
     }, { status: 400 });
  }

  const result = await TaxService.getTaxBillByNOP(nop);

  if (!result.success) {
     return NextResponse.json({ 
       success: false, 
       message: result.error 
     }, { status: 404 });
  }

  return NextResponse.json(result);
}

/**
 * POST /api/tax/simulate
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, value } = body;

    if (!type || !value) {
       return NextResponse.json({ 
         success: false, 
         message: "Tipe pajak dan nilai dasar harus diisi." 
       }, { status: 400 });
    }

    const result = await TaxService.calculateSimulation(type, value);
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("[TAX_SIMULATE_ERROR]", err);
    return NextResponse.json({ 
      success: false, 
      message: "Internal Server Error" 
    }, { status: 500 });
  }
}
