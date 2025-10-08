import React from "react";
//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SearchBar from "./SearchBar";
//import { useSidebar } from "@/components/ui/sidebar";
//import Hamburger from "./Hamburger";
import Link from "next/link";
import { hasEnvVars } from "@/lib/utils";
import { EnvVarWarning } from "./env-var-warning";
import { AuthButton } from "./auth-button";

const Navbar = () => {
  //const { toggleSidebar } = useSidebar();

  return (
    /*<nav className="p-4 flex items-center justify-between ">
       <Hamburger onClickHandler={toggleSidebar} /> 
      <div className="flex items-center gap-4">
        <div>Dashboard</div>
        <SearchBar />
        <Button>Post your artwork</Button>
        <Bell color="#628b35" />
        <CurrentUserAvatar />
      </div>
    </nav>
    */
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full flex justify-between items-center p-4 text-sm sm:gap-2">
        <div className="flex gap-5 items-center font-semibold">
          <Link href={"/"}>Next.js Supabase Starter</Link>
        </div>
        <SearchBar />
        {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
      </div>
    </nav>
  );
};

export default Navbar;
