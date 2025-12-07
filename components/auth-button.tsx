// "use server";

import { createClient } from "@/lib/supabase/server";
import React from "react";
import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import { LogoutButton } from "./logout-button";
import AppSideBar from "./app-side-bar";
import CurrentUserAvatarProfile from "./current-user-avatar-profile";
import BellButton from "./bell-button";
import { SafeLink } from "./safe-link";
import Link from "next/link";

export async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("users")
    .select("username")
    .eq("id", user?.id)
    .single();

  if (error) {
    console.log(data);
  }

  // Authenticated view
  if (user) {
    return (
      <div className="p-4 md:p-0 flex items-center relative pr-9 sm:pr-12 md:pr-0">
        <div className="flex items-center gap-1 sm:gap-4">
          {/* Mobile Post Button */}
          <div className="sm:hidden">
            <SafeLink href={`/create`}>
              <Button className="p-2">
                <Upload />
              </Button>
            </SafeLink>
          </div>

          {/* Desktop Post Button */}
          <SafeLink href={`/create`}>
            <Button className="hidden sm:block">Post your artwork</Button>
          </SafeLink>

          {/* Notifications */}
          <BellButton userId={user?.id} />

          {/* User Avatar */}
          <SafeLink
            href={
              data?.username
                ? `/users/${user?.id}?person=${data?.username}`
                : `/users/${user?.id}`
            }
          >
            <CurrentUserAvatarProfile
              classNameAvatar={""}
              classNameUseRound={""}
            />
          </SafeLink>

          {/* Logout */}
          <div className="hidden md:block">
            <LogoutButton variant="outline" compoenentClassName="" />
          </div>

          {/* Sidebar for mobile */}
          <div className="flex md:hidden absolute right-0 top-4">
            <AppSideBar />
          </div>
        </div>
      </div>
    );
  }

  // Unauthenticated view (unchanged)
  return (
    <div className="flex gap-2 py-4 md:py-0">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
