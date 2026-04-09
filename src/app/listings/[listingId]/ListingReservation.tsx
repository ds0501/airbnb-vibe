"use client";

import type { Range } from "react-date-range";
import { DateRange } from "react-date-range";
import { ko } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Button } from "@/components/ui/button";

interface ListingReservationProps {
  price: number;
  totalPrice: number;
  onChangeDateRange: (value: Range) => void;
  dateRange: Range;
  onSubmit: () => void;
  disabled: boolean;
  disabledDates: Date[];
}

export default function ListingReservation({
  price,
  totalPrice,
  onChangeDateRange,
  dateRange,
  onSubmit,
  disabled,
  disabledDates,
}: ListingReservationProps) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">₩ {price.toLocaleString()}</div>
        <div className="font-light text-neutral-600">/ 박</div>
      </div>
      <hr />
      <DateRange
        rangeColors={["#f43f5e"]}
        ranges={[dateRange]}
        date={new Date()}
        onChange={(value) => onChangeDateRange(value.selection)}
        direction="vertical"
        showDateDisplay={false}
        minDate={new Date()}
        disabledDates={disabledDates}
        locale={ko}
      />
      <hr />
      <div className="p-4">
        <Button
          disabled={disabled}
          onClick={onSubmit}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white"
        >
          예약하기
        </Button>
      </div>
      <hr />
      <div className="p-4 flex flex-row items-center justify-between font-semibold text-lg">
        <div>합계</div>
        <div>₩ {totalPrice.toLocaleString()}</div>
      </div>
    </div>
  );
}
