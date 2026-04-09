import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/actions/getCurrentUser";
import HomeClient from "./HomeClient";

interface HomePageProps {
  params: Promise<{ id: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { id } = await params;

  const [home, currentUser] = await Promise.all([
    prisma.home.findUnique({
      where: { id },
      include: {
        user: true,
        reservations: { select: { startDate: true, endDate: true } },
      },
    }),
    getCurrentUser(),
  ]);

  if (!home) notFound();

  // 현재 유저가 이 숙소를 즐겨찾기 했는지 확인
  const isFavorited = currentUser
    ? !!(await prisma.favorite.findUnique({
        where: { userId_homeId: { userId: currentUser.id, homeId: id } },
      }))
    : false;

  const serialized = {
    ...home,
    createdAt: home.createdAt.toISOString(),
    updatedAt: home.updatedAt.toISOString(),
    user: {
      ...home.user,
      createdAt: home.user.createdAt.toISOString(),
      updatedAt: home.user.updatedAt.toISOString(),
    },
    reservations: home.reservations.map((r) => ({
      startDate: r.startDate.toISOString(),
      endDate: r.endDate.toISOString(),
    })),
  };

  return <HomeClient home={serialized} currentUser={currentUser} isFavorited={isFavorited} />;
}
