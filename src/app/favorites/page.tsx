import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";
import EmptyState from "@/components/EmptyState";
import ListingCard from "@/components/listings/ListingCard";

export default async function FavoritesPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/api/auth/login");
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: currentUser.id },
    include: { home: true },
    orderBy: { createdAt: "desc" },
  });

  if (favorites.length === 0) {
    return (
      <EmptyState
        title="관심 목록이 없습니다"
        subtitle="마음에 드는 숙소의 하트를 눌러 저장해보세요!"
        showHome
      />
    );
  }

  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
      <h1 className="text-2xl font-bold mb-6">관심 목록</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {favorites.map((fav) => (
          <ListingCard
            key={fav.id}
            data={fav.home}
            currentUser={currentUser}
            isFavorited={true}
          />
        ))}
      </div>
    </div>
  );
}
