import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { Role } from "@prisma/client";


export async function requireAdmin() {

  const currentUser = await getCurrentUser();


  if (!currentUser) {
    return {
      status: "UNAUTHENTICATED" as const,
    };
  }


  const user = await prisma.user.findUnique({
    where: {
      id: currentUser.id,
    },
  });


  if (!user) {
    return {
      status: "UNAUTHENTICATED" as const,
    };
  }


  if (
    user.role !== Role.ADMIN &&
    user.role !== Role.CLIENT
  ) {
    return {
      status: "FORBIDDEN" as const,
      user,
    };
  }

  if (
    user.role === Role.CLIENT &&
    !user.clientId
) {
    return {
        status: "FORBIDDEN" as const,
        user,
    };
}


  return {
    status: "OK" as const,
    user,
  };

}