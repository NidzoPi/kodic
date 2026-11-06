
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const giveaways = await prisma.giveaway.findMany({
            where: {
                active: true,
                OR: [
                    {
                        endsAt: null,
                    },
                    {
                        endsAt: {
                            gte: new Date(),
                        },
                    },
                ],
            },
            select: {
                id: true,
                title: true,
                organizer: true,
                prize: true,
                description: true,
                rules: true,
                originalUrl: true,
                imageUrl: true,
                startsAt: true,
                endsAt: true,
                createdAt: true,
                _count: {
                    select: {
                        participations: true,
                        followers: true,
                    },
                },
            },
            orderBy: [
                {
                    endsAt: "asc",
                },
                {
                    createdAt: "desc",
                },
            ],
        });

        return NextResponse.json({
            giveaways,
        });
    } catch (error) {
        console.error("Greška pri učitavanju nagradnih igara:", error);

        return NextResponse.json(
            {
                error: "Greška pri učitavanju nagradnih igara",
            },
            {
                status: 500,
            }
        );
    }
}
