import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { Prisma } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth/currentUser";


export async function POST(req: Request) {

    const admin = await requireAdmin();


    if (!admin) {
        return NextResponse.json(
            {
                error: "Forbidden"
            },
            {
                status: 403
            }
        );
    }


    try {

        const body = await req.json();


        const {
            name,
            description,
            discount,
            discountType,
            totalCoupons,
            expiresAt
        } = body;


        if (
            !name ||
            !discount ||
            !totalCoupons
        ) {

            return NextResponse.json(
                {
                    error: "Sva polja su obavezna"
                },
                {
                    status: 400
                }
            );

        }

        const amount = Number(totalCoupons);
        const value = Number(discount);

        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                {
                    error: "Niste prijavljeni"
                },
                {
                    status: 401
                }
            );
        }



        const campaign = await prisma.campaign.create({
            data: {
                name,
                description,
                discount: Number(discount),
                discountType,
                totalCoupons: Number(totalCoupons),
                expiresAt: new Date(expiresAt),
                clientId:
                    user.role === "CLIENT"
                        ? user.clientId
                        : null,
            }
        });


        await prisma.scratchCard.createMany({

            data: Array.from(
                { length: amount },
                () => ({

                    campaignId: campaign.id,

                    discount: value

                })
            )

        });
        const testCard = await prisma.scratchCard.findFirst({
            where: {
                campaignId: campaign.id
            }
        });


        return NextResponse.json(
            {
                message: "Kampanja kreirana",
                campaign
            },
            {
                status: 201
            }
        );


    } catch (error) {

        console.error(error);


        return NextResponse.json(
            {
                error: "Server greška"
            },
            {
                status: 500
            }
        );

    }

}
export async function GET() {

    const result = await requireAdmin();


    if (result.status !== "OK") {

        return NextResponse.json(
            {
                error: "Forbidden"
            },
            {
                status: 403
            }
        );

    }


    const user = result.user;


    try {

        const campaigns =
            await prisma.campaign.findMany({

                where:
                    user.role === "ADMIN"
                        ? {}
                        : {
                            clientId: user.clientId
                        },


                orderBy: {
                    createdAt: "desc"
                }

            });


        return NextResponse.json({
            campaigns
        });


    } catch (error) {

        console.error(error);


        return NextResponse.json(
            {
                error: "Server greška"
            },
            {
                status: 500
            }
        );

    }

}
export async function DELETE(req: Request) {

    const result = await requireAdmin();


    if (result.status !== "OK") {
        return NextResponse.json(
            {
                error: "Forbidden"
            },
            {
                status: 403
            }
        );
    }


    try {

        const body = await req.json();

        const {
            id
        } = body;

        const campaign =
            await prisma.campaign.findUnique({
                where: {
                    id
                }
            });


        if (!campaign) {

            return NextResponse.json(
                {
                    error: "Kampanja nije pronađena"
                },
                {
                    status: 404
                }
            );

        }
        if (
            result.user.role === "CLIENT" &&
            campaign.clientId !== result.user.clientId
        ) {

            return NextResponse.json(
                {
                    error: "Nemate pravo brisati ovu kampanju"
                },
                {
                    status: 403
                }
            );

        }


        if (!id) {
            return NextResponse.json(
                {
                    error: "ID kampanje je obavezan"
                },
                {
                    status: 400
                }
            );
        }



        await prisma.$transaction([

            prisma.coupon.deleteMany({
                where: {
                    campaignId: id
                }
            }),

            prisma.scratchCard.deleteMany({
                where: {
                    campaignId: id
                }
            }),

            prisma.campaign.delete({
                where: {
                    id
                }
            })

        ]);



        return NextResponse.json({
            message: "Kampanja obrisana"
        });



    } catch (error) {

        console.error(error);


        return NextResponse.json(
            {
                error: "Server greška"
            },
            {
                status: 500
            }
        );

    }

}