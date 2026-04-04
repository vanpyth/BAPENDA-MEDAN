import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CMSService } from "@/lib/services/cms";
import { AuditService } from "@/lib/services/audit";

export const dynamic = "force-dynamic";

export async function GET() {
  console.log("[GET] Request received for /api/cms/news");
  try {
    const news = await CMSService.getNews(true);
    console.log("[GET] News fetched successfully, count:", news?.length || 0);
    return NextResponse.json(news || []);
  } catch (err: unknown) {
    console.error("[API_NEWS_GET_ERROR]", err);
    // Explicitly return JSON even on error
    return NextResponse.json({ 
      error: "SERVER_ERROR", 
      message: err instanceof Error ? err.message : "Unexpected database error" 
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, summary, content, category } = await req.json();

  try {
    const news = await CMSService.createNews({
      title,
      summary,
      content,
      category,
      authorId: session.user.id as string,
    });

    await AuditService.log({
      userId: session.user.id as string,
      action: "CREATE_NEWS",
      table: "News",
      recordId: news.id,
      newValue: news
    });
    return NextResponse.json(news);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to create news";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
