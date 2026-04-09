import { getCurrentUser } from "@/actions/getCurrentUser";
import { getListings } from "@/actions/getListings";
import EmptyState from "@/components/EmptyState";
import PropertiesClient from "./PropertiesClient";

export default async function PropertiesPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyState title="권한 없음" subtitle="로그인이 필요합니다." />;
  }

  const homes = await getListings({ userId: currentUser.id });

  if (homes.length === 0) {
    return (
      <EmptyState
        title="숙소가 없습니다"
        subtitle="아직 등록된 숙소가 없습니다."
        showReset
      />
    );
  }

  return <PropertiesClient homes={homes} currentUser={currentUser} />;
}
