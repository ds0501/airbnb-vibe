"use server";

import { prisma } from "@/lib/prisma";

interface ReservationsParams {
  homeId?: string;
  userId?: string;
  authorId?: string;
}

export async function getReservations(params: ReservationsParams) {
  const { homeId, userId, authorId } = params;

  const query: Record<string, unknown> = {};
  if (homeId) query.homeId = homeId;
  if (userId) query.userId = userId;
  if (authorId) query.home = { userId: authorId };

  const reservations = await prisma.reservation.findMany({
    where: query,
    include: { home: true },
    orderBy: { createdAt: "desc" },
  });

  return reservations.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    startDate: r.startDate.toISOString(),
    endDate: r.endDate.toISOString(),
    home: {
      ...r.home,
      createdAt: r.home.createdAt.toISOString(),
      updatedAt: r.home.updatedAt.toISOString(),
    },
  }));
}
