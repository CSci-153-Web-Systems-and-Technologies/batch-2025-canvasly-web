// "use client";

//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
//import { useSidebar } from "@/components/ui/sidebar";
//import Hamburger from "./Hamburger";
//import Link from "next/link";
import { hasEnvVars } from "@/lib/utils";
import { EnvVarWarning } from "./env-var-warning";
import { AuthButton } from "./auth-button";
//import { Search } from "lucide-react";
//import { cn } from "@/lib/utils";
//import { Input } from "./ui/input";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { navItems } from "@/lib/constants";
import SearchBar from "./search-bar";

//import { SidebarTrigger } from "./ui/sidebar";
//import { useSidebar } from "./ui/sidebar";
//import AuthButtonContainer from "./ui/auth-button-container";
//import Hamburger from "@/components/hamburger";

const Navbar = () => {
  return (
    /*<nav className="p-4 flex items-center justify-between ">
       <Hamburger onClickHandler={toggleSidebar} /> 
      <div className="flex items-center gap-4">
        <div>Dashboard</div>
        
        <Button>Post your artwork</Button>
        <Bell color="#628b35" />
        <CurrentUserAvatar />
      </div>
    </nav>
    */
    <nav className="w-full flex flex-col justify-center md:pt-4 px-4 border-b-2 border-b-foreground/10 md:border-none h-15 fixed top-0 left-0 right-0 bg-white z-50">
      <div className="w-full flex justify-between items-center text-sm sm:gap-2">
        {/* <div className="flex gap-5 items-center font-semibold"></div>*/}

        <Link className="hidden md:block" href={"/"}>
          <Image
            src="/CanvaslySideBarLogo.png"
            alt="logo"
            width={100}
            height={50}
          />
        </Link>

        <SearchBar />

        <div className="flex items-center">
          {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}

          {/* <Button
            variant="ghost"
            className="md:hidden bg-color-background rounded-3xl p-2 hover:bg-[#ededed]"
          >
            <Menu color="#666666" />
          </Button> */}
        </div>
      </div>
      <div className="w-full border-b-2 border-b-foreground/10 h-10 px-4 text-sm hidden md:block">
        <div className="flex items-center flex-row">
          {navItems.map((item) => (
            <Link href={item.href} key={item.name}>
              <Button className="p-2" variant="link">
                {item.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
