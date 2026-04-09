import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8">
      {/* 제목 + 하트 */}
      <div className="flex items-start justify-between mb-2">
        <Skeleton className="h-8 w-64 rounded-md" />
        <Skeleton className="h-7 w-7 rounded-full" />
      </div>

      {/* 위치 */}
      <Skeleton className="h-4 w-32 mb-6 rounded-md" />

      {/* 대표 사진 */}
      <Skeleton className="w-full h-[55vh] rounded-2xl mb-8" />

      {/* 본문 2단 레이아웃 */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-10">
        {/* 좌측 */}
        <div className="md:col-span-4 flex flex-col gap-8">
          {/* 호스트 */}
          <div className="flex items-center justify-between pb-6 border-b">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-48 rounded-md" />
              <Skeleton className="h-4 w-64 rounded-md" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
          {/* 카테고리 */}
          <div className="flex items-center gap-3 pb-6 border-b">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-24 rounded-md" />
              <Skeleton className="h-4 w-40 rounded-md" />
            </div>
          </div>
          {/* 설명 */}
          <div className="pb-6 border-b flex flex-col gap-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
          </div>
          {/* 지도 */}
          <div className="flex flex-col gap-4">
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-[35vh] w-full rounded-xl" />
          </div>
        </div>

        {/* 우측 예약 카드 */}
        <div className="md:col-span-3">
          <Skeleton className="w-full h-[500px] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
