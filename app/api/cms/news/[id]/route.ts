import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CMSService } from "@/lib/services/cms";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const updated = await CMSService.updateNews(params.id, session.user.id, body);
    return NextResponse.json(updated);
  } catch (err: unknown) {
    console.error("[NEWS_PATCH_ERROR]", err);
    return NextResponse.json({ error: "Failed to update news" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await CMSService.deleteNews(params.id, session.user.id);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[NEWS_DELETE_ERROR]", err);
    return NextResponse.json({ error: "Failed to delete news" }, { status: 500 });
  }
}
