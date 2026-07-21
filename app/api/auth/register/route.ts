import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/auth/jwt";
import { randomUUID } from "crypto";


export async function POST(req: Request) {

    try {

        const body = await req.json();

        const {
            name,
            email,
            password,
            referralCode
        } = body;


        if (!email || !password) {
            return NextResponse.json(
                {
                    error: "Email i lozinka su obavezni"
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
                    error: "Korisnik već postoji"
                },
                {
                    status: 400
                }
            );

        }


        const hashedPassword =
            await bcrypt.hash(password, 10);


        let referredById = null;
        if (referralCode) {

            const referrer =
                await prisma.user.findUnique({
                    where: {
                        referralCode
                    }
                });


            if (referrer) {
                referredById = referrer.id;
            }

        }
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                referredById,
                referralCode: randomUUID(),
            },
        });
        if (referredById) {

            await prisma.user.update({
                where: {
                    id: referredById
                },
                data: {
                    extraScratches: {
                        increment: 1
                    }
                }
            });

        }


        const token =
            await createToken(user.id);


        const response =
            NextResponse.json({

                message: "Registracija uspješna",

                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }

            });


        response.cookies.set(
            "token",
            token,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7,
                path: "/"
            }
        );


        return response;


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