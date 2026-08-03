import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import { prisma } from "@/lib/prisma";


export async function getCurrentUser() {

  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;


  if (!token) {
    return null;
  }


  const payload = await verifyToken(token);


  if (!payload) {
    return null;
  }


  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      clientId: true,
    },
  });


  return user;

}