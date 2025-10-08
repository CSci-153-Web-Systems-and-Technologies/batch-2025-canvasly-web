//"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import React from "react";
//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";

import { CurrentUserAvatar } from "./current-user-avatar";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  return user ? (
    <>
      {/* <div className="flex items-center gap-4">
        Hey, {user.email}!
        <LogoutButton />
      </div> */}
      <nav className="p-4 flex items-center ">
        {/* <Hamburger onClickHandler={toggleSidebar} /> */}
        <div className="flex items-center gap-4">
          <Button>Post your artwork</Button>
          <Bell color="#628b35" />
          <CurrentUserAvatar />
          <LogoutButton />
        </div>
      </nav>
    </>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
