import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const object = await prisma.taxObject.findFirst({
      where: {
        id: id,
        // Non-admin/officer can only view their own objects
        ...(!["ADMIN", "OFFICER"].includes(session.user.role)
          ? { ownerId: session.user.id }
          : {}),
      },
      include: {
        payments: {
          orderBy: { taxPeriod: "desc" },
          select: {
            id: true,
            invoiceNumber: true,
            taxPeriod: true,
            amount: true,
            status: true,
            paidAt: true,
            expiredAt: true,
          },
        },
        owner: {
          select: { name: true, email: true, phone: true },
        },
      },
    });

    if (!object) {
      return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(object);
  } catch (error) {
    console.error("[TAX_OBJECT_GET_BY_ID]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
