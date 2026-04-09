"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { SafeListing, User } from "@/types";
import ListingCard from "@/components/listings/ListingCard";

interface PropertiesClientProps {
  homes: SafeListing[];
  currentUser: User;
}

export default function PropertiesClient({ homes, currentUser }: PropertiesClientProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");

  const onDelete = useCallback(
    async (id: string) => {
      setDeletingId(id);
      try {
        const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
        toast.success("숙소가 삭제되었습니다.");
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
      <h1 className="text-2xl font-bold mb-6">나의 숙소</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {homes.map((home) => (
          <ListingCard
            key={home.id}
            data={home}
            actionId={home.id}
            onAction={onDelete}
            disabled={deletingId === home.id}
            actionLabel="숙소 삭제"
            currentUser={currentUser}
          />
        ))}
      </div>
    </div>
  );
}
