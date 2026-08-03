import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/currentUser";


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

                campaign: {
                    include: {
                        client: true
                    }
                }

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
    const currentUser = await getCurrentUser();


    if (
        currentUser?.role === "CLIENT" &&
        coupon.campaign.clientId !== currentUser.clientId
    ) {

        return NextResponse.json(
            {
                error: "Nemate pristup ovom kuponu"
            },
            {
                status: 403
            }
        );

    }

    return NextResponse.json(coupon);

}