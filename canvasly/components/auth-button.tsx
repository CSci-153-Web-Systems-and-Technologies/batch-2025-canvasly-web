//"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import React from "react";
//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, UserRound, Upload } from "lucide-react";
import { Button } from "./ui/button";

//import { CurrentUserAvatar } from "./current-user-avatar";
import { LogoutButton } from "./logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AppSideBar from "./app-side-bar";

export async function AuthButton() {
  const supabase = await createClient();

  {
    /* // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims; */
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <>
      {/* <div className="flex items-center gap-4">
        Hey, {user.email}!
        <LogoutButton />
      </div> */}
      <div className="p-4 flex items-center relative pr-9 sm:pr-12 md:pr-0 md:p-4">
        {/* <Hamburger onClickHandler={toggleSidebar} /> */}
        <div className="flex items-center gap-1 sm:gap-4">
          <Button className="sm:hidden p-2">
            <Upload />
          </Button>
          <Link href={`/create`}>
            <Button className="hidden sm:block">Post your artwork</Button>
          </Link>
          <Button
            variant="ghost"
            className="bg-color-background rounded-3xl p-2 hover:bg-[#ededed]"
          >
            <Bell color="#628b35" />
          </Button>
          <Link href={`/users/${user?.id}`}>
            <Avatar>
              <AvatarImage alt="@user" />
              <AvatarFallback>
                <UserRound color="#666666" />
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="hidden md:block">
            <LogoutButton variant="outline" compoenentClassName="" />
          </div>
          <div className="flex md:hidden absolute right-0 top-4">
            <AppSideBar />
          </div>
        </div>
      </div>
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
