import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {

    const code =
        request.nextUrl.searchParams.get("code");

    if (!code) {

        return NextResponse.json(
            {
                error: "Kod nije unesen"
            },
            {
                status: 400
            }
        );

    }

    const coupon =
        await prisma.coupon.findFirst({

            where: {

                code: code.toUpperCase()

            },

            include: {

                user: true,

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

    return NextResponse.json(coupon);

}