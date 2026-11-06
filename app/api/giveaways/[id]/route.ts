
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/currentUser";

type RouteContext = {
    params: Promise<{ id: string }>;
};

async function getAvailableGiveaway(id: string) {
    return prisma.giveaway.findFirst({
        where: {
            id,
            active: true,
            OR: [
                { endsAt: null },
                { endsAt: { gte: new Date() } },
            ],
        },
        select: {
            id: true,
        },
    });
}

// GET – provjera korisnikovog učešća i praćenja
export async function GET(
    _req: Request,
    { params }: RouteContext
) {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json(
            { error: "Niste prijavljeni." },
            { status: 401 }
        );
    }

    try {
        const { id } = await params;

        const giveaway = await getAvailableGiveaway(id);

        if (!giveaway) {
            return NextResponse.json(
                { error: "Nagradna igra nije pronađena ili je završena." },
                { status: 404 }
            );
        }

        const [participation, follow] = await Promise.all([
            prisma.giveawayParticipation.findUnique({
                where: {
                    giveawayId_userId: {
                        giveawayId: id,
                        userId: user.id,
                    },
                },
            }),
            prisma.giveawayFollow.findUnique({
                where: {
                    giveawayId_userId: {
                        giveawayId: id,
                        userId: user.id,
                    },
                },
            }),
        ]);

        return NextResponse.json({
            participated: Boolean(participation),
            following: Boolean(follow),
            notifyWinner: follow?.notifyWinner ?? false,
        });
    } catch (error) {
        console.error("Greška pri provjeri statusa:", error);

        return NextResponse.json(
            { error: "Greška na serveru." },
            { status: 500 }
        );
    }
}

// POST – evidentiranje učešća ili praćenja
export async function POST(
    req: Request,
    { params }: RouteContext
) {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json(
            { error: "Niste prijavljeni." },
            { status: 401 }
        );
    }

    try {
        const { id } = await params;
        const body = await req.json();

        const giveaway = await getAvailableGiveaway(id);

        if (!giveaway) {
            return NextResponse.json(
                { error: "Nagradna igra nije pronađena ili je završena." },
                { status: 404 }
            );
        }

        if (body.action === "participate") {
            await prisma.giveawayParticipation.upsert({
                where: {
                    giveawayId_userId: {
                        giveawayId: id,
                        userId: user.id,
                    },
                },
                create: {
                    giveawayId: id,
                    userId: user.id,
                },
                update: {},
            });

            return NextResponse.json({
                message: "Učešće je evidentirano.",
                participated: true,
            });
        }

        if (body.action === "follow") {
            const notifyWinner = body.notifyWinner !== false;

            await prisma.giveawayFollow.upsert({
                where: {
                    giveawayId_userId: {
                        giveawayId: id,
                        userId: user.id,
                    },
                },
                create: {
                    giveawayId: id,
                    userId: user.id,
                    notifyWinner,
                },
                update: {
                    notifyWinner,
                },
            });

            return NextResponse.json({
                message: "Praćenje nagradne igre je uključeno.",
                following: true,
                notifyWinner,
            });
        }

        return NextResponse.json(
            { error: "Nepoznata akcija." },
            { status: 400 }
        );
    } catch (error) {
        console.error("Greška pri evidentiranju:", error);

        return NextResponse.json(
            { error: "Greška na serveru." },
            { status: 500 }
        );
    }
}

// DELETE – uklanjanje učešća ili praćenja
export async function DELETE(
    req: Request,
    { params }: RouteContext
) {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json(
            { error: "Niste prijavljeni." },
            { status: 401 }
        );
    }

    try {
        const { id } = await params;
        const body = await req.json();

        if (body.action === "participate") {
            await prisma.giveawayParticipation.deleteMany({
                where: {
                    giveawayId: id,
                    userId: user.id,
                },
            });

            return NextResponse.json({
                message: "Evidencija učešća je uklonjena.",
                participated: false,
            });
        }

        if (body.action === "follow") {
            await prisma.giveawayFollow.deleteMany({
                where: {
                    giveawayId: id,
                    userId: user.id,
                },
            });

            return NextResponse.json({
                message: "Praćenje je isključeno.",
                following: false,
            });
        }

        return NextResponse.json(
            { error: "Nepoznata akcija." },
            { status: 400 }
        );
    } catch (error) {
        console.error("Greška pri uklanjanju:", error);

        return NextResponse.json(
            { error: "Greška na serveru." },
            { status: 500 }
        );
    }
}
