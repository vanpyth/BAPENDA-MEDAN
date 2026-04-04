import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

function genTicket() {
  const y = new Date().getFullYear();
  return `PPID-${y}${Math.floor(Math.random() * 90000) + 10000}`;
}

const Schema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  description: z.string().min(20, "Deskripsi minimal 20 karakter"),
  informationType: z.enum(["DOKUMEN", "DATA_STATISTIK", "KEBIJAKAN", "ANGGARAN", "LAINNYA"]),
  urgency: z.enum(["NORMAL", "URGENT"]).default("NORMAL"),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const isAdmin = ["ADMIN", "DEVELOPER", "OFFICER"].includes(session.user.role);

    const requests = await prisma.pPIDRequest.findMany({
      where: isAdmin ? {} : { userId: session.user.id },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("[PPID_GET]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validasi gagal", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const request = await prisma.pPIDRequest.create({
      data: {
        ...parsed.data,
        ticketNumber: genTicket(),
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true, request }, { status: 201 });
  } catch (error) {
    console.error("[PPID_POST]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
