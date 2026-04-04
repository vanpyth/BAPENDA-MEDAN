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

    // 1. Total Revenue (PAID payments)
    const paidPayments = await prisma.payment.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    });
    const totalRevenue = Number(paidPayments._sum.amount || 0);

    // 2. New Taxpayers (Total users with role USER)
    const userCount = await prisma.user.count({
      where: { role: "USER" },
    });

    // 3. Total Tax Objects
    const taxObjectCount = await prisma.taxObject.count();

    // 4. Pending Tasks (Complaints + PPID + Research which are PENDING/OPEN)
    const pendingComplaints = await prisma.complaint.count({ 
      where: { status: { in: ["OPEN", "IN_PROGRESS"] } } 
    });
    const pendingPPID = await prisma.pPIDRequest.count({ 
      where: { status: { in: ["OPEN", "IN_PROGRESS"] } } 
    });
    const pendingResearch = await prisma.researchRequest.count({ 
      where: { status: "PENDING" } 
    });
    const totalPending = pendingComplaints + pendingPPID + pendingResearch;

    // 5. Recent Activity (Latest 5 audit logs)
    const recentActivity = await prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    });

    return NextResponse.json({
      stats: {
        totalRevenue,
        userCount,
        taxObjectCount,
        totalPending,
        pendingComplaints,
        pendingPPID,
        pendingResearch,
      },
      recentActivity,
    });
  } catch (error) {
    console.error("[ADMIN_STATS_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
