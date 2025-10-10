// "use client";

//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
//import { useSidebar } from "@/components/ui/sidebar";
//import Hamburger from "./Hamburger";
//import Link from "next/link";
import { hasEnvVars } from "@/lib/utils";
import { EnvVarWarning } from "./env-var-warning";
import { AuthButton } from "./auth-button";
import { Search } from "lucide-react";
//import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { navItems } from "@/lib/constants";

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
    <nav className="w-full flex flex-col justify-center px-4 md:mt-4 h-16 border-b border-b-foreground/10 md:border-none">
      <div className="w-full flex justify-between items-center text-sm sm:gap-2">
        {/* <div className="flex gap-5 items-center font-semibold"></div>*/}
        <Link className="md:hidden" href={"/"}>
          <Image src="/CanvaslyLogo.png" alt="logo" width={30} height={30} />
        </Link>
        <Link className="hidden md:block" href={"/"}>
          <Image
            src="/CanvaslySideBarLogo.png"
            alt="logo"
            width={100}
            height={50}
          />
        </Link>

        <div className="flex items-center gap-2 relative w-1/3">
          <Search color="#7d7d7d" className="absolute ml-3 hidden sm:block" />
          <Input
            placeholder="Search works"
            id="search"
            className="sm:pl-10"
          ></Input>
        </div>
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
      <div className="w-full border-b border-b-foreground/10 h-16 px-4 text-sm hidden md:block">
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
