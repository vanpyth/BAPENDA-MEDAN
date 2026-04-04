import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AuditService } from "@/lib/services/audit";
import { NotificationService } from "@/lib/services/notification";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "OFFICER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { status } = body;

    const oldObject = await prisma.taxObject.findUnique({ where: { id } });
    
    const object = await prisma.taxObject.update({
      where: { id },
      data: { status },
    });

    await AuditService.log({
      userId: session.user.id,
      action: "UPDATE_TAX_OBJECT_STATUS",
      table: "TaxObject",
      recordId: id,
      oldValue: oldObject,
      newValue: object,
    });

    await NotificationService.notify({
      userId: object.ownerId,
      type: status === "VERIFIED" ? "SUCCESS" : "ERROR",
      title: "Update Objek Pajak",
      message: `Aset Anda (${object.nop}) telah ${status === "VERIFIED" ? "diverifikasi" : "ditolak"} oleh tim Bapenda Medan.`,
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error("[ADMIN_TAX_OBJECTS_PATCH]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
