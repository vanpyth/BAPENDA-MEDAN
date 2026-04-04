import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CMSService } from "@/lib/services/cms";
import { createAuditLog } from "@/lib/audit";

export async function GET() {
  const articles = await CMSService.getArticles(true);
  return NextResponse.json(articles);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, summary, content } = await req.json();

  try {
    const article = await CMSService.createArticle({
      title,
      summary,
      content,
      authorId: session.user.id as string,
    });

    await createAuditLog(
      "CREATE_ARTICLE",
      "Article",
      article.id,
      session.user.id as string,
      null,
      article
    );
    return NextResponse.json(article);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to create article";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
