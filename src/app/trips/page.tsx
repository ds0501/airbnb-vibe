import { getCurrentUser } from "@/actions/getCurrentUser";
import { getReservations } from "@/actions/getReservations";
import EmptyState from "@/components/EmptyState";
import TripsClient from "./TripsClient";

export default async function TripsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyState title="권한 없음" subtitle="로그인이 필요합니다." />;
  }

  const reservations = await getReservations({ userId: currentUser.id });

  if (reservations.length === 0) {
    return (
      <EmptyState
        title="여행이 없습니다"
        subtitle="아직 예약된 여행이 없습니다."
        showHome
      />
    );
  }

  return <TripsClient reservations={reservations} currentUser={currentUser} />;
}
