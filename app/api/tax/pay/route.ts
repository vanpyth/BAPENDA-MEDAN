import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { PaymentService } from "@/lib/services/payment";

// GET /api/tax/pay — list user payments
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payments = await prisma.payment.findMany({
      where: { userId: session.user.id },
      include: { taxObject: { select: { nop: true, type: true, name: true, address: true, njop: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("[PAYMENTS_GET]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/tax/pay — Initialize real payment with Midtrans
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { paymentId } = await req.json();
    if (!paymentId) return NextResponse.json({ error: "paymentId wajib diisi" }, { status: 400 });

    const token = await PaymentService.createSnapToken(paymentId);

    return NextResponse.json({ 
      success: true, 
      token, // Snap token for frontend
      clientKey: process.env.MIDTRANS_CLIENT_KEY 
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    console.error("[PAYMENT_INIT_POST]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
