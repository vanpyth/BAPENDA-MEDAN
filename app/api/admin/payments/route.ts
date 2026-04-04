import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "OFFICER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payments = await prisma.payment.findMany({
      include: {
        user: {
          select: { name: true, email: true }
        },
        taxObject: {
          select: { nop: true, name: true, type: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 100, // Limit for performance
    });

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("[ADMIN_PAYMENTS_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
