import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
);

export async function GET() {
  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "openid",
      "email",
      "profile",
    ],
    prompt: "select_account",
  });

  return NextResponse.redirect(url);
}