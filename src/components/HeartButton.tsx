"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { toast } from "sonner";
// 로그인 여부만 확인하므로 id 필드만 있으면 충분 (User/SafeUser 모두 허용)
interface HeartButtonProps {
  homeId: string;
  currentUser?: { id: string } | null;
  isFavorited?: boolean;
}

export default function HeartButton({ homeId, currentUser, isFavorited = false }: HeartButtonProps) {
  const router = useRouter();
  // 낙관적 업데이트: 서버 응답 전 UI 즉시 반응
  const [favorited, setFavorited] = useState(isFavorited);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFavorite = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      if (!currentUser) {
        router.push("/api/auth/login");
        return;
      }
      if (isLoading) return;

      // 낙관적 업데이트 — 즉시 UI 반영
      setFavorited((prev) => !prev);
      setIsLoading(true);

      try {
        const method = favorited ? "DELETE" : "POST";
        const res = await fetch(`/api/favorites/${homeId}`, { method });

        if (!res.ok) {
          // 실패 시 롤백
          setFavorited((prev) => !prev);
          toast.error("잠시 후 다시 시도해주세요.");
        } else {
          toast.success(favorited ? "관심 목록에서 삭제되었습니다." : "관심 목록에 추가되었습니다!");
          router.refresh();
        }
      } catch {
        setFavorited((prev) => !prev);
        toast.error("오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    },
    [currentUser, favorited, homeId, isLoading, router]
  );

  return (
    <div
      onClick={toggleFavorite}
      className="relative hover:opacity-80 transition cursor-pointer"
    >
      {/* 흰색 테두리 효과 */}
      <AiOutlineHeart size={28} className="fill-white absolute -top-[2px] -right-[2px]" />
      {/* 채워진 하트 — favorited 여부로 색상 변경 */}
      <AiFillHeart
        size={24}
        className={favorited ? "fill-rose-500" : "fill-neutral-500/70"}
      />
    </div>
  );
}
