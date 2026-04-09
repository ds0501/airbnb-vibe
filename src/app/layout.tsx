import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/navbar/Navbar";
import ModalProvider from "@/components/modals/ModalProvider";
import { getCurrentUser } from "@/actions/getCurrentUser";

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Airbnb Clone",
  description: "에어비앤비 클론 프로젝트",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="ko">
      <body className={font.className}>
        <Toaster />
        <ModalProvider />
        <Navbar currentUser={currentUser} />
        <main className="pb-20 pt-40">{children}</main>
      </body>
    </html>
  );
}
