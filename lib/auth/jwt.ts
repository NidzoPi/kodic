import { SignJWT, jwtVerify } from "jose";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET nije definisan");
}

const secret = new TextEncoder().encode(jwtSecret);

export async function createToken(userId: string) {
  return await new SignJWT({
    userId,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}


export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(
      token,
      secret
    );

    return payload as {
      userId: string;
    };

  } catch {
    return null;
  }
}