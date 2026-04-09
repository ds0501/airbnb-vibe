import type { User } from "@/types";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import CategoriesWrapper from "./CategoriesWrapper";

interface NavbarProps {
  currentUser?: User | null;
}

export default function Navbar({ currentUser }: NavbarProps) {
  return (
    <nav className="fixed w-full bg-white z-10 shadow-sm">
      <div className="py-4 border-b">
        <div className="flex flex-row items-center justify-between gap-3 md:gap-0 max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
          <Logo />
          <Search />
          <UserMenu currentUser={currentUser} />
        </div>
      </div>
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2">
        <CategoriesWrapper />
      </div>
    </nav>
  );
}
