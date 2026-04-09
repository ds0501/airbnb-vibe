import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";
import EmptyState from "@/components/EmptyState";
import ReservationsClient from "./ReservationsClient";

export default async function ReservationsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/api/auth/login");
  }

  const [reservations, favorites] = await Promise.all([
    prisma.reservation.findMany({
      where: { userId: currentUser.id },
      include: { home: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.favorite.findMany({
      where: { userId: currentUser.id },
      select: { homeId: true },
    }),
  ]);

  if (reservations.length === 0) {
    return (
      <EmptyState
        title="예약 내역이 없습니다"
        subtitle="아직 예약한 숙소가 없습니다."
        showHome
      />
    );
  }

  const favoritedHomeIds = favorites.map((f) => f.homeId);

  const serialized = reservations.map((r) => ({
    id: r.id,
    startDate: r.startDate.toISOString(),
    endDate: r.endDate.toISOString(),
    totalPrice: r.totalPrice,
    home: {
      ...r.home,
      createdAt: r.home.createdAt.toISOString(),
      updatedAt: r.home.updatedAt.toISOString(),
    },
  }));

  return (
    <ReservationsClient
      reservations={serialized}
      currentUser={currentUser}
      favoritedHomeIds={favoritedHomeIds}
    />
  );
}
