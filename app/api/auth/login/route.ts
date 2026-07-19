import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/auth/jwt";


export async function POST(req: Request) {

  try {

    const body = await req.json();

    const {
      email,
      password
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


    const user =
      await prisma.user.findUnique({
        where: {
          email
        }
      });


    if (!user) {

      return NextResponse.json(
        {
          error: "Pogrešan email ili lozinka"
        },
        {
          status: 401
        }
      );

    }


    const passwordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!passwordCorrect) {

      return NextResponse.json(
        {
          error: "Pogrešan email ili lozinka"
        },
        {
          status: 401
        }
      );

    }


    const token =
      await createToken(user.id);


    const response =
      NextResponse.json({

        message: "Uspješna prijava",

        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
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


  } catch(error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Server greška"
      },
      {
        status:500
      }
    );

  }

}