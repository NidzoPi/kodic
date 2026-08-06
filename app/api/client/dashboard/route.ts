import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { Role } from "@prisma/client";


export async function GET() {

    const user = await getCurrentUser();


    if (!user) {

        return NextResponse.json(
            {
                error: "Unauthorized"
            },
            {
                status: 401
            }
        );

    }



    if (user.role !== Role.CLIENT) {

        return NextResponse.json(
            {
                error: "Forbidden"
            },
            {
                status: 403
            }
        );

    }



    if (!user.clientId) {

        return NextResponse.json(
            {
                error: "Client nije povezan"
            },
            {
                status: 400
            }
        );

    }



    const campaigns =
        await prisma.campaign.findMany({

            where: {
                clientId: user.clientId
            },

            include: {

                _count: {
                    select: {
                        coupons: true
                    }
                },

                coupons: {

                    where: {
                        redeemedAt: {
                            not: null
                        }
                    },

                    select: {
                        id: true
                    }

                }

            }

        });



    const activeCampaigns =
        campaigns.length;



    const totalCoupons =
        campaigns.reduce(
            (sum, campaign) =>
                sum + campaign._count.coupons,
            0
        );



    const redeemedCoupons =
        campaigns.reduce(
            (sum, campaign) =>
                sum + campaign.coupons.length,
            0
        );



    const usageRate =
        totalCoupons === 0
            ? 0
            : Math.round(
                (redeemedCoupons / totalCoupons) * 100
            );



    return NextResponse.json({

        activeCampaigns,

        totalCoupons,

        redeemedCoupons,

        usageRate

    });

}