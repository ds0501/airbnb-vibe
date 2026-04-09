import dynamic from "next/dynamic";

// SSR 완전 비활성화 — Leaflet은 window 객체를 사용하므로 서버에서 렌더링 불가
const MapClient = dynamic(() => import("./MapClient"), {
  ssr: false,
  loading: () => (
    <div className="h-[35vh] rounded-xl bg-neutral-200 animate-pulse" />
  ),
});

interface MapProps {
  center: [number, number];
}

export default function Map({ center }: MapProps) {
  return <MapClient center={center} />;
}
