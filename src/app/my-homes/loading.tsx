import { Skeleton } from "@/components/ui/skeleton";
import ListingCardSkeleton from "@/components/listings/ListingCardSkeleton";

export default function Loading() {
  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
      <Skeleton className="h-8 w-40 mb-6 rounded-md" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
