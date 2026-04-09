import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ listingId: string }> }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { listingId: homeId } = await params;

  const favorite = await prisma.favorite.upsert({
    where: { userId_homeId: { userId: currentUser.id, homeId } },
    create: { userId: currentUser.id, homeId },
    update: {},
  });

  return NextResponse.json(favorite, { status: 201 });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ listingId: string }> }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { listingId: homeId } = await params;

  await prisma.favorite.deleteMany({
    where: { userId: currentUser.id, homeId },
  });

  return NextResponse.json({ success: true });
}
