
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

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

// Odbacivanje Facebook objave
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const auth = await checkAdmin();
    if (auth.response) return auth.response;

    const { id } = await context.params;

    const result = await prisma.giveawayImport.updateMany({
      where: {
        id,
        status: "PENDING",
      },
      data: {
        status: "DISMISSED",
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Objava nije pronađena ili je već obrađena." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Greška pri odbacivanju objave:", error);

    return NextResponse.json(
      { error: "Greška pri odbacivanju objave." },
      { status: 500 }
    );
  }
}

// Pretvaranje Facebook objave u javnu nagradnu igru
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const auth = await checkAdmin();
    if (auth.response) return auth.response;

    const { id } = await context.params;
    const body = await request.json();

    const title = String(body.title ?? "").trim();
    const prize = String(body.prize ?? "").trim();
    const organizer = String(body.organizer ?? "").trim();
    const rules = String(body.rules ?? "").trim();

    const startsAt = body.startsAt
      ? new Date(body.startsAt)
      : null;

    const endsAt = body.endsAt
      ? new Date(body.endsAt)
      : null;

    // Obavezni su samo naziv i datum početka.
    // Nagrada može ostati prazna.
    if (!title || !startsAt) {
      return NextResponse.json(
        { error: "Naziv i datum početka su obavezni." },
        { status: 400 }
      );
    }

    if (Number.isNaN(startsAt.getTime())) {
      return NextResponse.json(
        { error: "Datum početka nije ispravan." },
        { status: 400 }
      );
    }

    if (
      endsAt &&
      (Number.isNaN(endsAt.getTime()) || endsAt <= startsAt)
    ) {
      return NextResponse.json(
        {
          error:
            "Datum završetka nije ispravan. Mora biti nakon datuma početka.",
        },
        { status: 400 }
      );
    }

    const giveaway = await prisma.$transaction(async (tx) => {
      const importedPost = await tx.giveawayImport.findUnique({
        where: { id },
      });

      if (!importedPost || importedPost.status !== "PENDING") {
        throw new Error("IMPORT_NOT_PENDING");
      }

      const createdGiveaway = await tx.giveaway.create({
        data: {
          title,
          organizer: organizer || importedPost.sourcePageName,
          prize,
          description: importedPost.description,
          imageUrl: importedPost.imageUrl,
          originalUrl: importedPost.originalUrl,
          rules: rules || null,
          startsAt,
          endsAt,
          active: true,
        },
      });

      await tx.giveawayImport.update({
        where: { id },
        data: {
          status: "IMPORTED",
          giveawayId: createdGiveaway.id,
        },
      });

      return createdGiveaway;
    });

    return NextResponse.json(
      { success: true, giveaway },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "IMPORT_NOT_PENDING") {
      return NextResponse.json(
        { error: "Objava nije pronađena ili je već obrađena." },
        { status: 409 }
      );
    }

    console.error("Greška pri odobravanju objave:", error);

    return NextResponse.json(
      { error: "Greška pri kreiranju nagradne igre." },
      { status: 500 }
    );
  }
}
