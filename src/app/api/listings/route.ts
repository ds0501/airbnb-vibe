import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const homeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  photo: z.string().min(1),
  categoryName: z.string().min(1),
  bedrooms: z.number().min(1),
  bathrooms: z.number().min(1),
  guests: z.number().min(1),
  country: z.string().min(1),
  price: z.number().min(1),
});

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = homeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const home = await prisma.home.create({
    data: { ...parsed.data, userId: currentUser.id },
  });

  return NextResponse.json(home, { status: 201 });
}
