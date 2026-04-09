"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { DateRange, type RangeKeyDict } from "react-date-range";
import { ko } from "date-fns/locale";
import { toast } from "sonner";
import type { User } from "@/types";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface Reservation {
  startDate: string;
  endDate: string;
}

interface ReservationCardProps {
  homeId: string;
  price: number;
  reservations: Reservation[];
  currentUser: User | null;
}

const initialRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

export default function ReservationCard({
  homeId,
  price,
  reservations,
  currentUser,
}: ReservationCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState(initialRange);
  const [totalPrice, setTotalPrice] = useState(price);

  // 이미 예약된 날짜 비활성화
  const disabledDates = reservations.flatMap((r) =>
    eachDayOfInterval({ start: new Date(r.startDate), end: new Date(r.endDate) })
  );

  useEffect(() => {
    const days = differenceInCalendarDays(dateRange.endDate, dateRange.startDate);
    setTotalPrice(days > 0 ? days * price : price);
  }, [dateRange, price]);

  const handleSelect = useCallback((ranges: RangeKeyDict) => {
    const sel = ranges.selection;
    setDateRange({
      startDate: sel.startDate ?? new Date(),
      endDate: sel.endDate ?? new Date(),
      key: "selection",
    });
  }, []);

  const onReserve = useCallback(async () => {
    if (!currentUser) {
      router.push("/api/auth/login");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homeId,
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString(),
          totalPrice,
        }),
      });

      if (!res.ok) throw new Error();
      toast.success("예약이 완료되었습니다!");
      router.refresh();
      setDateRange(initialRange);
    } catch {
      toast.error("예약에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, homeId, dateRange, totalPrice, router]);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-md overflow-hidden">
      {/* 가격 헤더 */}
      <div className="flex items-baseline gap-1 p-6 border-b">
        <span className="text-2xl font-bold">₩ {price.toLocaleString()}</span>
        <span className="text-neutral-500 font-light">/ 박</span>
      </div>

      {/* 달력 */}
      <DateRange
        rangeColors={["#f43f5e"]}
        ranges={[dateRange]}
        date={new Date()}
        onChange={handleSelect}
        direction="vertical"
        showDateDisplay={false}
        minDate={new Date()}
        disabledDates={disabledDates}
        locale={ko}
        className="w-full"
      />

      <div className="p-6 flex flex-col gap-4 border-t">
        {/* 총 가격 */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-neutral-500">
            ₩ {price.toLocaleString()} ×{" "}
            {Math.max(differenceInCalendarDays(dateRange.endDate, dateRange.startDate), 1)}박
          </span>
          <span className="font-semibold">₩ {totalPrice.toLocaleString()}</span>
        </div>

        {/* 예약 버튼 */}
        <button
          onClick={onReserve}
          disabled={isLoading}
          className="w-full py-3 bg-rose-500 hover:bg-rose-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition"
        >
          {isLoading ? "예약 중..." : currentUser ? "예약하기" : "로그인 후 예약"}
        </button>
      </div>
    </div>
  );
}
