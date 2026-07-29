import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/currentUser";


export async function GET() {

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


    const coupons = await prisma.coupon.findMany({

        where: {
            userId: currentUser.id
        },

        include: {
            campaign: {
                include: {
                    _count: {
                        select: {
                            coupons: true
                        }
                    }
                }
            }
        },

        orderBy: {
            createdAt: "desc"
        }

    });


    return NextResponse.json(coupons);

}