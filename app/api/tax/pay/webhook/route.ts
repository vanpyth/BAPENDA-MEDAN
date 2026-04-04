import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/lib/services/payment";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // In production, we should verify the signature with Midtrans
    // But for simplification, we just pass the body to the service
    await PaymentService.handleWebhook(body);
    
    return NextResponse.json({ status: "OK" });
  } catch (error) {
    console.error("[MIDTRANS_WEBHOOK_ERROR]", error);
    return NextResponse.json({ error: "Webhook process failed" }, { status: 500 });
  }
}
