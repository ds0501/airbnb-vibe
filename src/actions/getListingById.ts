"use server";

import { prisma } from "@/lib/prisma";

export async function getListingById(homeId: string) {
  const home = await prisma.home.findUnique({
    where: { id: homeId },
    include: {
      user: true,
      reservations: true,
    },
  });

  if (!home) return null;

  return {
    ...home,
    createdAt: home.createdAt.toISOString(),
    updatedAt: home.updatedAt.toISOString(),
    user: {
      ...home.user,
      createdAt: home.user.createdAt.toISOString(),
      updatedAt: home.user.updatedAt.toISOString(),
    },
    reservations: home.reservations.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      startDate: r.startDate.toISOString(),
      endDate: r.endDate.toISOString(),
    })),
  };
}
