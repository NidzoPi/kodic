
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";

async function checkAdmin() {
  const result = await requireAdmin();

  if (result.status === "UNAUTHENTICATED") {
    return {
      response: NextResponse.json(
        { error: "Niste prijavljeni." },
        { status: 401 }
      ),
    };
  }

  if (result.status !== "OK" || result.user.role !== "ADMIN") {
    return {
      response: NextResponse.json(
        { error: "Nemate dozvolu za ovu akciju." },
        { status: 403 }
      ),
    };
  }

  return { response: null };
}

// Pregled objava koje čekaju pregled
export async function GET() {
  try {
    const auth = await checkAdmin();
    if (auth.response) return auth.response;

    const imports = await prisma.giveawayImport.findMany({
      where: { status: "PENDING" },
      orderBy: { importedAt: "desc" },
    });

    return NextResponse.json({ imports });
  } catch (error) {
    console.error("Greška pri učitavanju Facebook objava:", error);

    return NextResponse.json(
      { error: "Greška pri učitavanju objava." },
      { status: 500 }
    );
  }
}

// Ručni unos probne Facebook objave
export async function POST(request: NextRequest) {
  try {
    const auth = await checkAdmin();
    if (auth.response) return auth.response;

    const body = await request.json();

    const sourcePageName = String(body.sourcePageName ?? "").trim();
    const description = String(body.description ?? "").trim();
    const originalUrl = String(body.originalUrl ?? "").trim();
    const imageUrl = String(body.imageUrl ?? "").trim();

    if (!sourcePageName || !description || !originalUrl) {
      return NextResponse.json(
        { error: "Naziv stranice, opis i link objave su obavezni." },
        { status: 400 }
      );
    }

    try {
      new URL(originalUrl);

      if (imageUrl) {
        new URL(imageUrl);
      }
    } catch {
      return NextResponse.json(
        { error: "Link objave ili slike nije ispravan." },
        { status: 400 }
      );
    }

    let publishedAt: Date | null = null;

    if (body.publishedAt) {
      publishedAt = new Date(body.publishedAt);

      if (Number.isNaN(publishedAt.getTime())) {
        return NextResponse.json(
          { error: "Datum objave nije ispravan." },
          { status: 400 }
        );
      }
    }

    const importedPost = await prisma.giveawayImport.create({
      data: {
        sourcePostId: `manual_${randomUUID()}`,
        sourcePageId: "MANUAL",
        sourcePageName,
        description,
        imageUrl: imageUrl || null,
        originalUrl,
        publishedAt,
      },
    });

    return NextResponse.json(
      { success: true, importedPost },
      { status: 201 }
    );
  } catch (error) {
    console.error("Greška pri ručnom uvozu objave:", error);

    return NextResponse.json(
      { error: "Greška pri kreiranju probne objave." },
      { status: 500 }
    );
  }
}
