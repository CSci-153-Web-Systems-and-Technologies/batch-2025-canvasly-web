import { AuthButton } from "./auth-button";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "./search-bar";
import NavLinks from "./nav-links";

const Navbar = () => {
  return (
    <nav className="w-full flex flex-col justify-center md:pt-4 px-4 border-b-2 border-b-foreground/10 md:border-none h-15 fixed top-0 left-0 right-0 bg-white z-50">
      <div className="w-full flex justify-between items-center text-sm sm:gap-2">
        <Image
          src="/CanvaslySideBarLogo.png"
          alt="logo"
          width={100}
          height={50}
        />

        <SearchBar />

        <div className="flex items-center">
          <AuthButton />
        </div>
      </div>
      <NavLinks />
    </nav>
  );
};

export default Navbar;
