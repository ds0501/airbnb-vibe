"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { SafeListing } from "@/types";
import { Button } from "../ui/button";
import HeartButton from "../HeartButton";

interface ReservationWithDates {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
}

interface ListingCardProps {
  data: SafeListing;
  reservation?: ReservationWithDates;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: { id: string } | null;
  isFavorited?: boolean;
}

export default function ListingCard({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  currentUser,
  isFavorited = false,
}: ListingCardProps) {
  const router = useRouter();

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) return;
      onAction?.(actionId);
    },
    [disabled, onAction, actionId]
  );

  const price = useMemo(
    () => (reservation ? reservation.totalPrice : data.price),
    [reservation, data.price]
  );

  const reservationDate = useMemo(() => {
    if (!reservation) return null;
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);
    return `${format(start, "M월 d일", { locale: ko })} - ${format(end, "M월 d일", { locale: ko })}`;
  }, [reservation]);

  return (
    <div
      onClick={() => router.push(`/home/${data.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          <Image
            fill
            className="object-cover h-full w-full group-hover:scale-105 transition duration-300 ease-in-out"
            src={data.photo}
            alt={data.title}
          />
          <div className="absolute top-3 right-3">
            <HeartButton
              homeId={data.id}
              currentUser={currentUser}
              isFavorited={isFavorited}
            />
          </div>
        </div>
        <div className="font-semibold text-lg">{data.country}</div>
        <div className="font-light text-neutral-500">
          {reservationDate ?? data.categoryName}
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">₩ {price.toLocaleString()}</div>
          {!reservation && <div className="font-light">/ 박</div>}
        </div>
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            onClick={handleCancel}
            variant="destructive"
            size="sm"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
