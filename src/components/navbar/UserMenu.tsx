"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import {
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { useRouter, usePathname } from "next/navigation";
import type { User } from "@/types";
import Avatar from "../Avatar";
import MenuItem from "./MenuItem";
import useRentModal from "@/hooks/useRentModal";

interface UserMenuProps {
  currentUser?: User | null;
}

export default function UserMenu({ currentUser }: UserMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const rentModal = useRentModal();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  // 페이지 이동 시 메뉴 닫기
  useEffect(() => {
    close();
  }, [pathname, close]);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, close]);

  const onRent = useCallback(() => {
    close();
    if (!currentUser) {
      router.push("/api/auth/login");
      return;
    }
    rentModal.onOpen();
  }, [currentUser, rentModal, router, close]);

  return (
    <div className="relative" ref={menuRef}>
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={onRent}
          className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
        >
          당신의 공간을 에어비앤비로
        </div>
        <div
          onClick={toggleOpen}
          className="p-4 md:py-1 md:px-2 border border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar src={currentUser?.profileImage} />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm z-10">
          <div className="flex flex-col cursor-pointer">
            {currentUser ? (
              <>
                <MenuItem onClick={() => router.push("/reservations")} label="나의 예약" />
                <MenuItem onClick={() => router.push("/favorites")} label="관심 목록" />
                <MenuItem onClick={() => router.push("/my-homes")} label="나의 숙소" />
                <MenuItem onClick={rentModal.onOpen} label="에어비앤비 호스트 되기" />
                <hr />
                <LogoutLink>
                  <MenuItem onClick={close} label="로그아웃" />
                </LogoutLink>
              </>
            ) : (
              <>
                <LoginLink>
                  <MenuItem onClick={close} label="로그인" />
                </LoginLink>
                <RegisterLink>
                  <MenuItem onClick={close} label="회원가입" />
                </RegisterLink>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
