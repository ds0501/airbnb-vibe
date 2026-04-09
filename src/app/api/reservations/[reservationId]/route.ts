import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ reservationId: string }> }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { reservationId } = await params;

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { home: true },
  });
  if (!reservation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isOwner =
    reservation.userId === currentUser.id || reservation.home.userId === currentUser.id;
  if (!isOwner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.reservation.delete({ where: { id: reservationId } });
  return NextResponse.json({ success: true });
}
