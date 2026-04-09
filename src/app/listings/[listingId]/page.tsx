import { getListingById } from "@/actions/getListingById";
import { getReservations } from "@/actions/getReservations";
import { getCurrentUser } from "@/actions/getCurrentUser";
import EmptyState from "@/components/EmptyState";
import ListingClient from "./ListingClient";

interface ListingPageProps {
  params: Promise<{ listingId: string }>;
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { listingId } = await params;
  const listing = await getListingById(listingId);
  const reservations = await getReservations({ homeId: listingId });
  const currentUser = await getCurrentUser();

  if (!listing) {
    return <EmptyState title="숙소를 찾을 수 없습니다" subtitle="존재하지 않는 숙소입니다." />;
  }

  return (
    <ListingClient
      listing={listing}
      reservations={reservations}
      currentUser={currentUser}
    />
  );
}
