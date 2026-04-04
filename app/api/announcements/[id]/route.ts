import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AuditService } from "@/lib/services/audit";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, category, isActive } = await req.json();
    const oldVal = await prisma.announcement.findUnique({ where: { id: id } });

    const updated = await prisma.announcement.update({
      where: { id: id },
      data: {
        title,
        content,
        category,
        isActive,
      },
      include: { author: { select: { name: true } } },
    });

    await AuditService.log({
      userId: session.user.id,
      action: "UPDATE_ANNOUNCEMENT",
      table: "Announcement",
      recordId: updated.id,
      oldValue: oldVal || undefined,
      newValue: updated,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[ANNOUNCEMENT_PATCH]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deleted = await prisma.announcement.delete({
      where: { id: id },
    });

    await AuditService.log({
      userId: session.user.id,
      action: "DELETE_ANNOUNCEMENT",
      table: "Announcement",
      recordId: deleted.id,
      oldValue: deleted,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ANNOUNCEMENT_DELETE]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
