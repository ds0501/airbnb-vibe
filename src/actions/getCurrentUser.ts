"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser?.id || !kindeUser?.email) return null;

    const user = await prisma.user.findUnique({
      where: { id: kindeUser.id },
    });

    return user ?? null;
  } catch {
    return null;
  }
}
