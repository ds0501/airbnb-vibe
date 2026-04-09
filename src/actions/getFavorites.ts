"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./getCurrentUser";

export async function getFavorites() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return [];

  const favorites = await prisma.favorite.findMany({
    where: { userId: currentUser.id },
    include: { home: true },
    orderBy: { createdAt: "desc" },
  });

  return favorites.map((fav) => ({
    ...fav,
    createdAt: fav.createdAt.toISOString(),
    home: {
      ...fav.home,
      createdAt: fav.home.createdAt.toISOString(),
      updatedAt: fav.home.updatedAt.toISOString(),
    },
  }));
}
