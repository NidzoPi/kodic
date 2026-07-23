import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/currentUser";


export async function POST() {

    const currentUser = await getCurrentUser();


    if (!currentUser) {

        return NextResponse.json(
            {
                error: "Unauthorized"
            },
            {
                status: 401
            }
        );

    }


    const user = await prisma.user.findUnique({
        where: {
            id: currentUser.id
        }
    });


    if (!user) {

        return NextResponse.json(
            {
                error: "Korisnik ne postoji"
            },
            {
                status: 404
            }
        );

    }
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);


    const todayScratch =
        await prisma.scratchCard.findFirst({

            where: {
                userId: user.id,
                createdAt: {
                    gte: startOfDay
                }
            }

        });

    if (todayScratch && user.extraScratches <= 0) {

        return NextResponse.json(
            {
                error: "Već ste iskoristili današnje grebanje"
            },
            {
                status: 400
            }
        );

    }



    // aktivna kampanja

    const campaigns =
        await prisma.campaign.findMany({

            where: {
                active: true,

                scratchCards: {
                    some: {
                        scratched: false
                    }
                },
                NOT: {
                    coupons: {
                        some: {
                            userId: user.id
                        }
                    }
                }

            }

        });
    const userCoupons = await prisma.coupon.findMany({
        where: {
            userId: user.id
        },
        select: {
            campaignId: true
        }
    });

    console.log(
        "Korisnik vec ima kupone:",
        userCoupons
    );
    console.log(
        "Dostupne kampanje za korisnika:",
        campaigns.map(c => c.id)
    );


    if (campaigns.length === 0) {

        return NextResponse.json(
            {
                error: "Već ste iskoristili sve dostupne kampanje."
            },
            {
                status: 400
            }
        );

    }


    const campaign =
        campaigns[
        Math.floor(Math.random() * campaigns.length)
        ];



    if (!campaign) {

        return NextResponse.json(
            {
                error: "Nema aktivne kampanje",
                debug: "campaign null"
            },
            {
                status: 400
            }
        );

    }

    console.log("Campaign ID:", campaign.id);

    const cards = await prisma.scratchCard.findMany({
        where: {
            campaignId: campaign.id,
        },
    });

    console.log(cards);



    const scratchCard =
        await prisma.scratchCard.findFirst({

            where: {
                campaignId: campaign.id,
                userId: null,
                scratched: false
            }

        });



    if (!scratchCard) {

        return NextResponse.json(
            {
                error: "Nema dostupnih grebanja",
                debug: "cards empty"
            },
            {
                status: 400
            }
        );

    }



    const updatedCard =
        await prisma.scratchCard.update({

            where: {
                id: scratchCard.id
            },

            data: {
                userId: user.id,
                scratched: true
            }

        });




    console.log("PRIJE GREBANJA:", {
        todayScratch,
        extraScratches: user.extraScratches
    });




    if (todayScratch && user.extraScratches > 0) {

        await prisma.user.update({

            where: {
                id: user.id
            },

            data: {
                extraScratches: {
                    decrement: 1
                }
            }

        });

    }

    const coupon =
        await prisma.coupon.create({

            data: {

                code:
                    "SCR-" +
                    Math.random()
                        .toString(36)
                        .substring(2, 10)
                        .toUpperCase(),

                userId: user.id,

                campaignId: campaign.id,

                scratchCardId: updatedCard.id,

                discount: updatedCard.discount

            }

        });



    return NextResponse.json({

        message: "Grebanje uspješno",

        discount: updatedCard.discount,

        campaign: campaign.name,

        coupon: coupon.code,

        scratchCardId: updatedCard.id

    });


}