import { Skeleton } from "@/components/ui/skeleton";

export default function ListingCardSkeleton() {
  return (
    <div className="col-span-1">
      <div className="flex flex-col gap-2 w-full">
        {/* 이미지 */}
        <Skeleton className="aspect-square w-full rounded-xl" />
        {/* 국가 */}
        <Skeleton className="h-5 w-2/3 rounded-md" />
        {/* 카테고리 */}
        <Skeleton className="h-4 w-1/2 rounded-md" />
        {/* 가격 */}
        <Skeleton className="h-4 w-1/3 rounded-md" />
      </div>
    </div>
  );
}
