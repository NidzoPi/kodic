import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";


const secret = new TextEncoder().encode(
    process.env.JWT_SECRET
);


export async function middleware(
    request: NextRequest
) {


    const token =
        request.cookies.get("token")?.value;


    const { pathname } =
        request.nextUrl;



    // Ako je korisnik već prijavljen
    // ne dozvoljavamo login/register

    if (
        pathname.startsWith("/login") ||
        pathname.startsWith("/register")
    ) {


        if (token) {

            try {

                const { payload } =
                    await jwtVerify(
                        token,
                        secret
                    );


                if (payload.role === "ADMIN") {

                    return NextResponse.redirect(
                        new URL("/admin", request.url)
                    );

                }


                if (payload.role === "CLIENT") {

                    return NextResponse.redirect(
                        new URL("/client", request.url)
                    );

                }


                return NextResponse.redirect(
                    new URL("/dashboard", request.url)
                );


            } catch {

                // token nevažeći
                // pustimo korisnika na login

            }

        }

    }



    // Zaštićeni dashboard

    if (
        pathname.startsWith("/dashboard")
    ) {


        if (!token) {

            return NextResponse.redirect(
                new URL("/login", request.url)
            );

        }


        try {

            await jwtVerify(
                token,
                secret
            );


        } catch {


            return NextResponse.redirect(
                new URL("/login", request.url)
            );

        }

    }



    return NextResponse.next();

}



export const config = {

    matcher: [
        "/dashboard/:path*",
        "/login",
        "/register/:path*",
    ],

};