import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateCouponCode } from "@/lib/utils/coupon";

export async function POST() {
  try {

    // test korisnik
    const user = await prisma.user.findUnique({
      where: {
        email: "test@test.com",
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Korisnik ne postoji" },
        { status: 404 }
      );
    }


    // aktivna kampanja
    const campaign = await prisma.campaign.findFirst({
      where: {
        active: true,
      },
      include: {
        prizes: true,
      },
    });


    if (!campaign) {
      return NextResponse.json(
        { error: "Nema aktivne kampanje" },
        { status: 404 }
      );
    }


    // izbor nagrade po vjerovatnoći
    const random = Math.floor(Math.random() * 100) + 1;

    let total = 0;
    let selectedPrize = null;


    for (const prize of campaign.prizes) {
      total += prize.probability;

      if (random <= total) {
        selectedPrize = prize;
        break;
      }
    }


    if (!selectedPrize) {
      return NextResponse.json(
        { error: "Greška kod izbora nagrade" },
        { status: 500 }
      );
    }


    // kreiranje scratch kartice
    const scratchCard = await prisma.scratchCard.create({
      data: {
        userId: user.id,
        campaignId: campaign.id,
        prizeId: selectedPrize.id,
        scratched: true,
      },
    });

    const coupon = await prisma.coupon.create({
      data: {
        code: generateCouponCode(selectedPrize.discount),
        userId: user.id,
        prizeId: selectedPrize.id,
      },
    });


    return NextResponse.json({
      success: true,
      message: "Čestitamo!",
      prize: selectedPrize.name,
      discount: selectedPrize.discount,
      coupon: coupon.code,
      scratchCardId: scratchCard.id,
    });


  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server greška" },
      { status: 500 }
    );
  }
}