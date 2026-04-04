import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NotificationService } from "@/lib/services/notification";
import prisma from "@/lib/prisma";
import { AuditService } from "@/lib/services/audit";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, title, message, type, broadcast } = await req.json();

    if (broadcast) {
      const users = await prisma.user.findMany({ select: { id: true } });
      await Promise.all(
        users.map((user) =>
          NotificationService.notify({
            userId: user.id,
            title,
            message,
            type: type || "INFO",
          })
        )
      );

      await AuditService.log({
        userId: session.user.id,
        action: "BROADCAST_NOTIFICATION",
        table: "Notification",
        recordId: "GLOBAL",
        newValue: { title, message, type, count: users.length },
      });
    } else if (userId) {
      await NotificationService.notify({
        userId,
        title,
        message,
        type: type || "INFO",
      });

      await AuditService.log({
        userId: session.user.id,
        action: "SEND_DIRECT_NOTIFICATION",
        table: "Notification",
        recordId: userId,
        newValue: { title, message, type },
      });
    } else {
      return NextResponse.json({ error: "No target specified" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_NOTIFICATIONS_SEND]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
