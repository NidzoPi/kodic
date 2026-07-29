import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";


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
            totalCoupons
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


        const campaign = await prisma.campaign.create({
            data: {
                name,
                description,
                discount: Number(discount),
                discountType,
                totalCoupons: Number(totalCoupons)
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

        const campaigns =
            await prisma.campaign.findMany({

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
            id
        } = body;


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