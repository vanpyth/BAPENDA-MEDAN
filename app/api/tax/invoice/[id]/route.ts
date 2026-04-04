import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const payment = await prisma.payment.findFirst({
      where: {
        id,
        // Admin/Officer can view any payment, users only their own
        ...(["ADMIN", "DEVELOPER", "OFFICER"].includes(session.user.role)
          ? {}
          : { userId: session.user.id }),
      },
      include: {
        taxObject: true,
        user: { select: { name: true, email: true, nik: true, phone: true, address: true } },
      },
    });

    if (!payment) return NextResponse.json({ error: "Invoice tidak ditemukan" }, { status: 404 });

    return NextResponse.json({ payment });
  } catch (error) {
    console.error("[INVOICE_GET]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
