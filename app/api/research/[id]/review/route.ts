import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { AuditService } from "@/lib/services/audit";
import { NotificationService } from "@/lib/services/notification";

const ReviewSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  reviewNotes: z.string().optional(),
});

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
    const parsed = ReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const status = parsed.data.status;
    const request = await prisma.researchRequest.update({
      where: { id },
      data: {
        status,
        reviewNotes: parsed.data.reviewNotes,
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
      },
    });

    await AuditService.log({
      userId: session.user.id,
      action: "REVIEW_RESEARCH",
      table: "ResearchRequest",
      recordId: request.id,
      newValue: request,
    });

    await NotificationService.notify({
      userId: request.userId,
      type: status === "APPROVED" ? "SUCCESS" : "ERROR",
      title: `Status Riset: ${status}`,
      message: `Permohonan riset Anda (${request.requestNumber}) telah ${status === "APPROVED" ? "disetujui" : "ditolak"} oleh tim verifikator.`,
    });

    return NextResponse.json({ success: true, request });
  } catch (error) {
    console.error("[RESEARCH_REVIEW_PATCH]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
