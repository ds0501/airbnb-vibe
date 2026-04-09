"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { toast } from "sonner";
import type { Range } from "react-date-range";
import type { SafeReservation, SafeUser } from "@/types";
import type { getListingById } from "@/actions/getListingById";
import Map from "@/components/map/Map";
import HeartButton from "@/components/HeartButton";
import useCountries from "@/hooks/useCountries";
import Avatar from "@/components/Avatar";
import ListingReservation from "./ListingReservation";
import Image from "next/image";

type ListingType = NonNullable<Awaited<ReturnType<typeof getListingById>>>;

const initialDateRange: Range = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

interface ListingClientProps {
  listing: ListingType;
  reservations?: SafeReservation[];
  currentUser?: SafeUser | null;
}

export default function ListingClient({ listing, reservations = [], currentUser }: ListingClientProps) {
  const router = useRouter();
  const { getByValue } = useCountries();

  const location = getByValue(listing.locationValue);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];
    reservations.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });
      dates = [...dates, ...range];
    });
    return dates;
  }, [reservations]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(dateRange.endDate, dateRange.startDate);
      if (dayCount && listing.price) {
        setTotalPrice(dayCount * listing.price);
      } else {
        setTotalPrice(listing.price);
      }
    }
  }, [dateRange, listing.price]);

  const onCreateReservation = useCallback(async () => {
    if (!currentUser) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalPrice,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          listingId: listing.id,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("예약이 완료되었습니다!");
      setDateRange(initialDateRange);
      router.push("/trips");
    } catch {
      toast.error("예약 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, totalPrice, dateRange, listing.id, router]);

  return (
    <div className="max-w-screen-lg mx-auto px-4">
      <div className="flex flex-col gap-6">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">{listing.title}</h1>
          <HeartButton listingId={listing.id} currentUser={currentUser} />
        </div>

        <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
          <Image
            fill
            className="object-cover w-full"
            src={listing.imageSrc}
            alt={listing.title}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
          <div className="col-span-4 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <div className="text-xl font-semibold flex flex-row items-center gap-2">
                <p>{location?.label} 호스트</p>
                <Avatar src={listing.user.image} />
              </div>
              <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
                <div>{listing.guestCount}명의 게스트</div>
                <div>{listing.roomCount}개의 침실</div>
                <div>{listing.bathroomCount}개의 욕실</div>
              </div>
            </div>

            <hr />
            <p className="text-neutral-500 font-light">{listing.description}</p>
            <hr />
            <Map center={location?.latlng} />
          </div>

          <div className="order-first mb-10 md:order-last md:col-span-3">
            <ListingReservation
              price={listing.price}
              totalPrice={totalPrice}
              onChangeDateRange={(value) => setDateRange(value)}
              dateRange={dateRange}
              onSubmit={onCreateReservation}
              disabled={isLoading}
              disabledDates={disabledDates}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
