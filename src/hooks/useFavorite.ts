"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { SafeUser } from "@/types";

interface UseFavoriteProps {
  listingId: string;
  currentUser?: SafeUser | null;
}

const useFavorite = ({ listingId, currentUser }: UseFavoriteProps) => {
  const router = useRouter();

  const hasFavorited = useMemo(() => {
    // Checked via API/server — this is a placeholder for client state
    return false;
  }, []);

  const toggleFavorite = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      if (!currentUser) {
        toast.error("로그인이 필요합니다.");
        return;
      }

      try {
        const method = hasFavorited ? "DELETE" : "POST";
        const response = await fetch(`/api/favorites/${listingId}`, { method });

        if (!response.ok) throw new Error();

        router.refresh();
        toast.success(hasFavorited ? "즐겨찾기 해제" : "즐겨찾기 추가");
      } catch {
        toast.error("문제가 발생했습니다.");
      }
    },
    [currentUser, hasFavorited, listingId, router]
  );

  return { hasFavorited, toggleFavorite };
};

export default useFavorite;
