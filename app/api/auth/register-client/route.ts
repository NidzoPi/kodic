import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";


export async function POST(req: Request) {

    try {

        const body = await req.json();


        const {
            companyName,
            name,
            email,
            password,
            turnstileToken
        } = body;


        if (
            !companyName ||
            !name ||
            !email ||
            !password
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


        const existingUser =
            await prisma.user.findUnique({
                where: {
                    email
                }
            });


        if (existingUser) {

            return NextResponse.json(
                {
                    error: "Email već postoji"
                },
                {
                    status: 400
                }
            );

        }
        if (!turnstileToken) {
            return NextResponse.json(
                {
                    error: "Molimo potvrdite da niste robot."
                },
                {
                    status: 400
                }
            );
        }
        const turnstileResponse = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    secret: process.env.TURNSTILE_SECRET_KEY!,
                    response: turnstileToken
                })
            }
        );

        const turnstileData = await turnstileResponse.json();

        if (!turnstileData.success) {
            return NextResponse.json(
                {
                    error: "CAPTCHA provjera nije uspješna. Pokušajte ponovo."
                },
                {
                    status: 400
                }
            );
        }


        const hashedPassword =
            await bcrypt.hash(password, 10);



        const result =
            await prisma.$transaction(async (tx) => {


                const client =
                    await tx.client.create({

                        data: {
                            name: companyName
                        }

                    });



                const user =
                    await tx.user.create({

                        data: {

                            name,

                            email,

                            password: hashedPassword,

                            role: Role.CLIENT,

                            clientId: client.id

                        }

                    });



                return {
                    client,
                    user
                };

            });



        return NextResponse.json(
            {
                message: "Partnerski nalog kreiran",
                userId: result.user.id
            },
            {
                status: 201
            }
        );


    } catch (error) {

        console.error(error);


        return NextResponse.json(
            {
                error: "Greška servera"
            },
            {
                status: 500
            }
        );

    }

}