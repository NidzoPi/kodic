
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/currentUser";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Morate biti prijavljeni." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const now = new Date();

    const giveaway = await prisma.giveaway.findFirst({
      where: {
        id,
        active: true,
        AND: [
          {
            OR: [{ startsAt: null }, { startsAt: { lte: now } }],
          },
          {
            OR: [{ endsAt: null }, { endsAt: { gte: now } }],
          },
        ],
      },
      select: { id: true },
    });

    if (!giveaway) {
      return NextResponse.json(
        { error: "Nagradna igra nije aktivna ili je završena." },
        { status: 404 }
      );
    }

    const existing = await prisma.giveawayParticipation.findUnique({
      where: {
        giveawayId_userId: {
          giveawayId: id,
          userId: user.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyParticipated: true,
        message: "Već si evidentirao učešće.",
      });
    }

    await prisma.giveawayParticipation.create({
      data: {
        giveawayId: id,
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      alreadyParticipated: false,
      message: "Učešće je uspješno evidentirano.",
    });
  } catch (error) {
    console.error("Greška pri evidentiranju učešća:", error);

    return NextResponse.json(
      { error: "Došlo je do greške. Pokušaj ponovo." },
      { status: 500 }
    );
  }
}
