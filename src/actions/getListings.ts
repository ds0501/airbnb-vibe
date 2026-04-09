"use server";

import { prisma } from "@/lib/prisma";

export interface ListingsParams {
  userId?: string;
  guests?: number | string;
  bedrooms?: number | string;
  bathrooms?: number | string;
  startDate?: string;
  endDate?: string;
  country?: string;
  categoryName?: string;
}

export async function getListings(params: ListingsParams = {}) {
  const { userId, guests, bedrooms, bathrooms, startDate, endDate, country, categoryName } =
    params;

  const query: Record<string, unknown> = {};

  if (userId)       query.userId = userId;
  if (categoryName) query.categoryName = categoryName;
  if (country)      query.country = country;
  if (bedrooms)     query.bedrooms  = { gte: Number(bedrooms) };
  if (guests)       query.guests    = { gte: Number(guests) };
  if (bathrooms)    query.bathrooms = { gte: Number(bathrooms) };

  // 날짜 필터: 예약 날짜와 겹치는 숙소 제외
  if (startDate && endDate) {
    query.NOT = {
      reservations: {
        some: {
          OR: [
            // 기존 예약이 체크인 날짜를 포함
            { startDate: { lte: startDate }, endDate: { gte: startDate } },
            // 기존 예약이 체크아웃 날짜를 포함
            { startDate: { lte: endDate }, endDate: { gte: endDate } },
            // 기존 예약이 선택 범위를 완전히 감싸는 경우
            { startDate: { gte: startDate }, endDate: { lte: endDate } },
          ],
        },
      },
    };
  }

  const homes = await prisma.home.findMany({
    where: query,
    orderBy: { createdAt: "desc" },
  });

  return homes.map((home) => ({
    ...home,
    createdAt: home.createdAt.toISOString(),
    updatedAt: home.updatedAt.toISOString(),
  }));
}
