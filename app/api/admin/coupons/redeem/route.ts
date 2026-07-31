import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function POST(
    request: NextRequest
) {

    const body = await request.json();

    const { id } = body;


    if (!id) {

        return NextResponse.json(
            {
                error: "ID kupona nedostaje"
            },
            {
                status: 400
            }
        );

    }


    const coupon =
        await prisma.coupon.findUnique({

            where: {
                id
            },
            include: {
                campaign: true
            }

        });


    if (!coupon) {

        return NextResponse.json(
            {
                error: "Kupon nije pronađen"
            },
            {
                status: 404
            }
        );

    }
    if (!coupon.campaign.active) {

        return NextResponse.json(
            {
                error: "Kampanja više nije aktivna"
            },
            {
                status: 400
            }
        );

    }


    if (
        coupon.expiresAt &&
        new Date(coupon.expiresAt) < new Date()
    ) {

        return NextResponse.json(
            {
                error: "Kupon je istekao"
            },
            {
                status: 400
            }
        );

    }


    if (!coupon) {

        return NextResponse.json(
            {
                error: "Kupon nije pronađen"
            },
            {
                status: 404
            }
        );

    }


    if (coupon.redeemedAt) {

        return NextResponse.json(
            {
                error: "Kupon je već iskorišten"
            },
            {
                status: 400
            }
        );

    }


    const updatedCoupon =
        await prisma.coupon.update({

            where: {
                id
            },

            data: {
                redeemedAt: new Date()
            },

            include: {
                user: true,
                campaign: true
            }

        });


    return NextResponse.json(updatedCoupon);

}