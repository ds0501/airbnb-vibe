"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Home, User } from "@/types";
import ListingCard from "@/components/listings/ListingCard";

type SerializedHome = Omit<Home, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

type ReservationWithHome = {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  home: SerializedHome;
};

interface ReservationsClientProps {
  reservations: ReservationWithHome[];
  currentUser: User;
  favoritedHomeIds: string[];
}

export default function ReservationsClient({ reservations, currentUser, favoritedHomeIds }: ReservationsClientProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");

  const onCancel = useCallback(
    async (id: string) => {
      setDeletingId(id);
      try {
        const res = await fetch(`/api/reservations/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
        toast.success("예약이 취소되었습니다.");
        router.refresh();
      } catch {
        toast.error("오류가 발생했습니다.");
      } finally {
        setDeletingId("");
      }
    },
    [router]
  );

  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
      <h1 className="text-2xl font-bold mb-6">나의 예약</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {reservations.map((reservation) => (
          <ListingCard
            key={reservation.id}
            data={reservation.home}
            reservation={reservation}
            actionId={reservation.id}
            onAction={onCancel}
            disabled={deletingId === reservation.id}
            actionLabel="예약 취소"
            currentUser={currentUser}
            isFavorited={favoritedHomeIds.includes(reservation.home.id)}
          />
        ))}
      </div>
    </div>
  );
}
