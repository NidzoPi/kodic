import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/auth/jwt";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
);

export async function GET(req: Request) {

  try {

    const url = new URL(req.url);

    const code = url.searchParams.get("code");

    if (!code) {

      return NextResponse.redirect(
        `${appUrl}/login?error=google`
      );

    }


    const { tokens } =
      await client.getToken(code);


    const ticket =
      await client.verifyIdToken({

        idToken: tokens.id_token!,

        audience:
          process.env.GOOGLE_CLIENT_ID,

      });


    const payload =
      ticket.getPayload();


    if (!payload) {

      return NextResponse.redirect(
        `${appUrl}/login?error=google`
      );

    }


    const googleId =
      payload.sub;

    const email =
      payload.email;

    const name =
      payload.name ?? null;


    if (!googleId || !email) {

      return NextResponse.redirect(
        `${appUrl}/login?error=google`
      );

    }


    let user =
      await prisma.user.findUnique({

        where: {
          googleId
        }

      });


    if (!user) {

      user =
        await prisma.user.findUnique({

          where: {
            email
          }

        });


      if (user) {

        user =
          await prisma.user.update({

            where: {
              id: user.id
            },

            data: {
              googleId
            }

          });

      }

    }


    if (!user) {

      user =
        await prisma.user.create({

          data: {

            name,

            email,

            googleId,

            password: "",

            role: "USER"

          }

        });

    }


    const token =
      await createToken(user.id);


    const response =
      NextResponse.redirect(
        `${appUrl}/dashboard`
      );


    response.cookies.set(
      "token",
      token,
      {

        httpOnly: true,

        secure:
          process.env.NODE_ENV === "production",

        sameSite: "lax",

        maxAge:
          60 * 60 * 24 * 7,

        path: "/"

      }
    );


    return response;


  } catch (error) {

    console.error(
      "GOOGLE LOGIN ERROR:",
      error
    );


    return NextResponse.redirect(
      `${appUrl}/login?error=google`
    );

  }

}