"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { BiSearch } from "react-icons/bi";
import { differenceInDays, parseISO } from "date-fns";
import useSearchModal from "@/hooks/useSearchModal";

function SearchInner() {
  const searchModal = useSearchModal();
  const params = useSearchParams();

  const country    = params.get("country");
  const guestCount = params.get("guests");
  const startDate  = params.get("startDate");
  const endDate    = params.get("endDate");

  const locationLabel = country ?? "어디든지";

  const dateLabel = useMemo(() => {
    if (!startDate || !endDate) return "언제든지";
    const nights = differenceInDays(parseISO(endDate), parseISO(startDate));
    return `${nights}박`;
  }, [startDate, endDate]);

  const guestLabel = guestCount ? `게스트 ${guestCount}명` : "게스트 추가";

  return (
    <div
      onClick={searchModal.onOpen}
      className="border w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer"
    >
      <div className="flex flex-row items-center justify-between">
        <div className="text-sm font-semibold px-6 truncate max-w-[120px]">
          {locationLabel}
        </div>
        <div className="hidden sm:block text-sm font-semibold px-6 border-x flex-1 text-center whitespace-nowrap">
          {dateLabel}
        </div>
        <div className="text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-3">
          <div className="hidden sm:block text-neutral-600 font-light whitespace-nowrap">
            {guestLabel}
          </div>
          <div className="p-2 bg-rose-500 rounded-full text-white">
            <BiSearch size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}

// useSearchParams → Suspense 필요
import { Suspense } from "react";

export default function Search() {
  return (
    <Suspense
      fallback={
        <div className="border w-full md:w-auto py-2 rounded-full shadow-sm">
          <div className="flex flex-row items-center justify-between">
            <div className="text-sm font-semibold px-6">어디든지</div>
            <div className="hidden sm:block text-sm font-semibold px-6 border-x flex-1 text-center">언제든지</div>
            <div className="text-sm pl-6 pr-2 flex items-center gap-3">
              <div className="hidden sm:block">게스트 추가</div>
              <div className="p-2 bg-rose-500 rounded-full text-white"><BiSearch size={18} /></div>
            </div>
          </div>
        </div>
      }
    >
      <SearchInner />
    </Suspense>
  );
}
