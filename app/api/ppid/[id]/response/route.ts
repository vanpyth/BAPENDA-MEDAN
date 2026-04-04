import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AuditService } from "@/lib/services/audit";
import { NotificationService } from "@/lib/services/notification";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "OFFICER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { response, status } = await req.json();
    if (!response) {
      return NextResponse.json({ error: "Respon tidak boleh kosong" }, { status: 400 });
    }

    const oldVal = await prisma.pPIDRequest.findUnique({ where: { id: id } });
    const updated = await prisma.pPIDRequest.update({
      where: { id: id },
      data: {
        response,
        responseAt: new Date(),
        status: status || "RESOLVED",
      },
    });

    await AuditService.log({
      userId: session.user.id,
      action: "RESPOND_PPID",
      table: "PPIDRequest",
      recordId: updated.id,
      oldValue: oldVal || undefined,
      newValue: updated,
    });

    await NotificationService.notify({
      userId: updated.userId,
      type: "SUCCESS",
      title: "Respon PPID Diterbitkan",
      message: `Permohonan informasi Anda (${updated.ticketNumber}) telah ditanggapi.`,
    });

    return NextResponse.json({ success: true, request: updated });
  } catch (error) {
    console.error("[PPID_RESPONSE_PATCH]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
