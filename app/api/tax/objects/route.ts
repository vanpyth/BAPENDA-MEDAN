import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AuditService } from "@/lib/services/audit";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const objects = await prisma.taxObject.findMany({
      where: { ownerId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(objects);
  } catch (error) {
    console.error("[TAX_OBJECTS_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { nop, type, name, address, luasTanah, luasBangun } = body;

    const object = await prisma.taxObject.create({
      data: {
        nop,
        type,
        name,
        address,
        luasTanah: parseFloat(luasTanah) || 0,
        luasBangun: parseFloat(luasBangun) || 0,
        ownerId: session.user.id,
        status: "PENDING",
      },
    });

    await AuditService.log({
      userId: session.user.id,
      action: "CREATE_TAX_OBJECT",
      table: "TaxObject",
      recordId: object.id,
      newValue: object,
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error("[TAX_OBJECTS_POST]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
