import { getListings, type ListingsParams } from "@/actions/getListings";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";
import EmptyState from "@/components/EmptyState";
import ListingCard from "@/components/listings/ListingCard";

interface HomeProps {
  searchParams: Promise<ListingsParams>;
}

export default async function HomePage({ searchParams }: HomeProps) {
  const params = await searchParams;
  const [homes, currentUser] = await Promise.all([
    getListings(params),
    getCurrentUser(),
  ]);

  // 현재 유저의 즐겨찾기 homeId 목록
  const favoriteIds = currentUser
    ? (
        await prisma.favorite.findMany({
          where: { userId: currentUser.id },
          select: { homeId: true },
        })
      ).map((f) => f.homeId)
    : [];

  // 검색 필터가 적용된 상태인지 판단
  const hasFilter = !!(
    params.country ||
    params.guests ||
    params.startDate ||
    params.endDate ||
    params.categoryName
  );

  if (homes.length === 0) {
    return (
      <EmptyState
        title={hasFilter ? "조건에 맞는 숙소가 없습니다" : "등록된 숙소가 없습니다"}
        subtitle={
          hasFilter
            ? "검색 조건을 변경하거나 필터를 초기화해 보세요."
            : "아직 등록된 숙소가 없습니다."
        }
        showReset={hasFilter}
      />
    );
  }

  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {homes.map((home) => (
          <ListingCard
            key={home.id}
            data={home}
            currentUser={currentUser}
            isFavorited={favoriteIds.includes(home.id)}
          />
        ))}
      </div>
    </div>
  );
}
