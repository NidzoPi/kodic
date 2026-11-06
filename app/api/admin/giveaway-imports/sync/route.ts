
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";

const GRAPH_VERSION = process.env.META_GRAPH_API_VERSION || "v26.0";

type MetaPage = {
  id: string;
  name: string;
};

type MetaPost = {
  id: string;
  message?: string;
  created_time?: string;
  permalink_url?: string;
  full_picture?: string;
};

type MetaResponse<T> = {
  data?: T;
  error?: {
    message?: string;
    type?: string;
    code?: number;
  };
};

async function checkAdmin() {
  const result = await requireAdmin();

  if (result.status === "UNAUTHENTICATED") {
    return NextResponse.json(
      { error: "Niste prijavljeni." },
      { status: 401 }
    );
  }

  if (result.status !== "OK" || result.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Nemate dozvolu za ovu akciju." },
      { status: 403 }
    );
  }

  return null;
}

async function graphRequest<T>(url: URL, token: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const result = (await response.json()) as MetaResponse<T>;

  if (!response.ok || result.error) {
    throw new Error(
      result.error?.message || `Facebook API greška: ${response.status}`
    );
  }

  return result as T;
}

export async function POST() {
  try {
    const authError = await checkAdmin();
    if (authError) return authError;

    const pageId = process.env.META_PAGE_ID;
    const accessToken = process.env.META_PAGE_ACCESS_TOKEN;

    if (!pageId || !accessToken) {
      return NextResponse.json(
        { error: "Nedostaje META_PAGE_ID ili META_PAGE_ACCESS_TOKEN u .env fajlu." },
        { status: 500 }
      );
    }

    // 1. Preuzimanje podataka o Facebook stranici
    const pageUrl = new URL(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pageId}`
    );
    pageUrl.searchParams.set("fields", "id,name");

    const page = await graphRequest<MetaPage>(pageUrl, accessToken);

    // 2. Preuzimanje posljednjih 100 objava koje je objavila stranica
    const postsUrl = new URL(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pageId}/published_posts`
    );

    postsUrl.searchParams.set(
      "fields",
      "id,message,created_time,permalink_url,full_picture"
    );
    postsUrl.searchParams.set("limit", "100");

    const postsResult = await graphRequest<{ data: MetaPost[] }>(
      postsUrl,
      accessToken
    );

    const posts = postsResult.data || [];

    // 3. Priprema novih objava za postojeću GiveawayImport tabelu
    const imports = posts
      .filter((post) => post.id && post.permalink_url)
      .map((post) => ({
        sourcePostId: post.id,
        sourcePageId: page.id,
        sourcePageName: page.name,
        description: post.message?.trim() || null,
        imageUrl: post.full_picture || null,
        originalUrl: post.permalink_url!,
        publishedAt: post.created_time
          ? new Date(post.created_time)
          : null,
        status: "PENDING" as const,
      }));

    // 4. Preskakanje objava koje su već uvezene
    const result = imports.length
      ? await prisma.giveawayImport.createMany({
          data: imports,
          skipDuplicates: true,
        })
      : { count: 0 };

    return NextResponse.json({
      success: true,
      page: page.name,
      fetched: posts.length,
      imported: result.count,
      skipped: imports.length - result.count,
      message: `Uvoz završen. Dodano novih objava: ${result.count}.`,
    });
  } catch (error) {
    console.error("Facebook Graph API sync greška:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Greška pri uvozu Facebook objava.",
      },
      { status: 500 }
    );
  }
}
