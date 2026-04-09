import EmptyState from "@/components/EmptyState";

export default function NotFound() {
  return (
    <EmptyState
      title="숙소를 찾을 수 없습니다"
      subtitle="존재하지 않거나 삭제된 숙소입니다."
      showReset
    />
  );
}
