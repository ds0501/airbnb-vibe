import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";
import EmptyState from "@/components/EmptyState";
import MyHomesClient from "./MyHomesClient";

export default async function MyHomesPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/api/auth/login");
  }

  const [homes, favorites] = await Promise.all([
    prisma.home.findMany({
      where: { userId: currentUser.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.favorite.findMany({
      where: { userId: currentUser.id },
      select: { homeId: true },
    }),
  ]);

  if (homes.length === 0) {
    return (
      <EmptyState
        title="등록된 숙소가 없습니다"
        subtitle="에어비앤비 호스트가 되어 숙소를 등록해보세요!"
        showHome
      />
    );
  }

  const favoritedHomeIds = favorites.map((f) => f.homeId);

  const serialized = homes.map((h) => ({
    ...h,
    createdAt: h.createdAt.toISOString(),
    updatedAt: h.updatedAt.toISOString(),
  }));

  return <MyHomesClient homes={serialized} currentUser={currentUser} favoritedHomeIds={favoritedHomeIds} />;
}
