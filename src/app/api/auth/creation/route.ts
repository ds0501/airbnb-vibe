import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return NextResponse.redirect(
      new URL(process.env.KINDE_SITE_URL ?? "http://localhost:3000")
    );
  }

  await prisma.user.upsert({
    where: { id: user.id },
    create: {
      id: user.id,
      email: user.email ?? "",
      firstName: user.given_name ?? "",
      lastName: user.family_name ?? "",
      profileImage: user.picture ?? "",
    },
    update: {
      email: user.email ?? "",
      firstName: user.given_name ?? "",
      lastName: user.family_name ?? "",
      profileImage: user.picture ?? "",
    },
  });

  return NextResponse.redirect(
    new URL(process.env.KINDE_SITE_URL ?? "http://localhost:3000")
  );
}
