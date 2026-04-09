import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ listingId: string }> }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { listingId: homeId } = await params;

  const home = await prisma.home.findUnique({ where: { id: homeId } });
  if (!home) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (home.userId !== currentUser.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.home.delete({ where: { id: homeId } });
  return NextResponse.json({ success: true });
}
