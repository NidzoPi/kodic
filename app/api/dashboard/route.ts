import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { prisma } from "@/lib/prisma";

export async function GET() {

    const currentUser = await getCurrentUser();

    if (!currentUser) {

        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );

    }

    const user = await prisma.user.findUnique({

        where: {
            id: currentUser.id,
        },

        include: {

            referrals: true,
            scratchCards: true,
            coupons: true,

        },

    });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayScratch = await prisma.scratchCard.findFirst({
        where: {
            userId: user!.id,
            createdAt: {
                gte: startOfDay
            }
        }
    });

    


    const dailyScratchAvailable = !todayScratch;

    const availableCampaigns = await prisma.campaign.count({
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
                        userId: user!.id
                    }
                }
            }
        }
    });
    const canScratch =
        availableCampaigns > 0 &&
    (
        !todayScratch ||
        user!.extraScratches > 0
    );

    const availableScratches =
    (!todayScratch ? 1 : 0) + user!.extraScratches;

    return NextResponse.json({

        name: user?.name,

        email: user?.email,

        referralCode: user?.referralCode,

        extraScratches: user?.extraScratches,

        referrals: user?.referrals.length,

        coupons: user?.coupons.length,

        dailyScratchAvailable,

        canScratch,

        availableCards: availableCampaigns,

        availableScratches,

    });

}