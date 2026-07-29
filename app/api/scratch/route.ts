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



    // PROVJERA DNEVNOG GREBANJA

    const startOfDay = new Date();

    startOfDay.setHours(0, 0, 0, 0);


    const todayScratch =
        await prisma.scratchCard.findFirst({

            where: {
                userId: user.id,
                scratched: true,
                scratchedAt: {
                    gte: startOfDay
                }
            }

        });


    console.log(
        "PROVJERA TODAY SCRATCH:",
        todayScratch
    );


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



    // TRAŽENJE DOSTUPNIH KAMPANJA

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



    console.log(
        "Dostupne kampanje:",
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



    // IZBOR NASUMIČNE KAMPANJE


    const campaign =
        campaigns[
        Math.floor(
            Math.random() * campaigns.length
        )
        ];



    console.log(
        "Campaign ID:",
        campaign.id
    );



    // TRAŽENJE KARTICE


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
                error: "Nema dostupnih grebanja"
            },
            {
                status: 400
            }
        );

    }



    console.log(
        "PRIJE GREBANJA:",
        {
            todayScratch,
            extraScratches: user.extraScratches
        }
    );



    // OZNAČAVANJE KARTICE KAO ISKORIŠTENE


    const updatedCard =
        await prisma.scratchCard.update({

            where: {
                id: scratchCard.id
            },

            data: {
                userId: user.id,
                scratched: true,
                scratchedAt: new Date()
            }

        });



    console.log(
        "KREIRANA KARTICA:",
        updatedCard
    );



    // TROŠENJE BONUS GREBANJA


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



    // KREIRANJE KUPONA


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

        discountType: campaign.discountType,

        campaign: campaign.name,

        coupon: coupon.code,

        scratchCardId: updatedCard.id

    });


}