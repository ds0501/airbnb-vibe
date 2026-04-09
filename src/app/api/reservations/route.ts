import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const reservationSchema = z.object({
  homeId: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  totalPrice: z.number().min(1),
});

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = reservationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const { homeId, startDate, endDate, totalPrice } = parsed.data;

  const reservation = await prisma.reservation.create({
    data: {
      userId: currentUser.id,
      homeId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalPrice,
    },
  });

  return NextResponse.json(reservation, { status: 201 });
}
