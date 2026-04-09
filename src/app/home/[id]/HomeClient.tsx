"use client";

import Image from "next/image";
import { Users, BedDouble, Bath, MapPin } from "lucide-react";
import { categories } from "@/lib/categories";
import useCountries from "@/hooks/useCountries";
import Map from "@/components/map/Map";
import ReservationCard from "./ReservationCard";
import HeartButton from "@/components/HeartButton";
import type { User } from "@/types";

type HomeWithDetails = {
  id: string;
  title: string;
  description: string;
  photo: string;
  price: number;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  country: string;
  categoryName: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    profileImage: string | null;
    email: string;
  };
  reservations: {
    startDate: string;
    endDate: string;
  }[];
};

interface HomeClientProps {
  home: HomeWithDetails;
  currentUser: User | null;
  isFavorited: boolean;
}

const DEFAULT_LATLNG: [number, number] = [37.5665, 126.9780]; // 서울 기본값

export default function HomeClient({ home, currentUser, isFavorited }: HomeClientProps) {
  const { getByLabel } = useCountries();
  const country = getByLabel(home.country);
  const center: [number, number] = country?.latlng
    ? [country.latlng[0], country.latlng[1]]
    : DEFAULT_LATLNG;

  const category = categories.find((c) => c.label === home.categoryName);
  const CategoryIcon = category?.icon;

  const hostName = [home.user.firstName, home.user.lastName].filter(Boolean).join(" ") || "호스트";

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8">
      {/* 제목 + 하트 */}
      <div className="flex items-start justify-between mb-2">
        <h1 className="text-2xl font-bold">{home.title}</h1>
        <HeartButton homeId={home.id} currentUser={currentUser} isFavorited={isFavorited} />
      </div>

      {/* 위치 */}
      <div className="flex items-center gap-1 text-neutral-500 text-sm mb-6">
        <MapPin size={14} />
        <span>{home.country}</span>
        {country && <span className="ml-1">{country.flag}</span>}
      </div>

      {/* 대표 사진 */}
      <div className="w-full h-[55vh] relative rounded-2xl overflow-hidden mb-8">
        <Image
          src={home.photo}
          alt={home.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* 본문 2단 레이아웃 */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-10">
        {/* ── 좌측 ─────────────────────────────── */}
        <div className="md:col-span-4 flex flex-col gap-8">
          {/* 호스트 정보 */}
          <div className="flex items-center justify-between pb-6 border-b">
            <div>
              <p className="text-xl font-semibold">
                {home.country} · {hostName} 님의 숙소
              </p>
              <div className="flex items-center gap-3 mt-1 text-sm text-neutral-500 font-light">
                <span className="flex items-center gap-1"><Users size={14} /> 게스트 {home.guests}명</span>
                <span>·</span>
                <span className="flex items-center gap-1"><BedDouble size={14} /> 침실 {home.bedrooms}개</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Bath size={14} /> 욕실 {home.bathrooms}개</span>
              </div>
            </div>
            {home.user.profileImage && (
              <Image
                src={home.user.profileImage}
                alt={hostName}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
            )}
          </div>

          {/* 카테고리 배지 */}
          {category && CategoryIcon && (
            <div className="flex flex-col gap-3 pb-6 border-b">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-neutral-100">
                  <CategoryIcon size={22} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="font-semibold">{category.label}</p>
                  <p className="text-sm text-neutral-500 font-light">{category.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* 설명 */}
          <div className="pb-6 border-b">
            <p className="text-neutral-600 font-light leading-relaxed whitespace-pre-line">
              {home.description}
            </p>
          </div>

          {/* 지도 */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">위치</h2>
            <p className="text-neutral-500 text-sm">{home.country}</p>
            <Map center={center} />
          </div>
        </div>

        {/* ── 우측 예약 카드 ─────────────────────── */}
        <div className="md:col-span-3">
          <div className="sticky top-28">
            <ReservationCard
              homeId={home.id}
              price={home.price}
              reservations={home.reservations}
              currentUser={currentUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
