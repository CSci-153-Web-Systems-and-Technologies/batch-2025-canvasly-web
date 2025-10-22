"use client";

import React, { useEffect, useState } from "react";
//import { AuthUser } from "@/components/auth-username-container";
import EditProfileDialog from "@/components/edit-profile-dialog";
//import CurrentUserAvatarProfile from "@/components/current-user-avatar-profile";
import { createClient } from "@/lib/client";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/actions/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import { pageTabs } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const genereateMetadata = (params) => {
  return {
    title: `${params?.searchParams?.person}'s profile`,
    description: `Profile page of user ${params?.params?.id}`,
  };
};
const ProfilePage = (params) => {
  const supabase = createClient();
  const [userAuth, setUserAuth] = useState<User | null>(null);
  const [selectedTab, setSelectedTab] = useState("1");

  useEffect(() => {
    const fetchUserAuth = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.log(error);
        return;
      }

      setUserAuth(user);
    };

    fetchUserAuth();
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user", params?.params?.id],
    queryFn: () => getUserById(params?.params?.id),
  });

  const changeToggleValue = (key: string) => {
    setSelectedTab(key);
  };

  return (
    <div className="w-full flex flex-col ">
      <div className="flex flex-col md:items-center  w-full p-4 sm:p-8 bg-[#f7f7f7]">
        <div className="flex flex-row gap-2 sm:gap-4 items-center max-w-7xl w-full">
          <Avatar className="h-20 w-20 reltive">
            <AvatarImage
              className="object-cover"
              src={data?.data?.image_url}
              alt="@user"
            />
            <AvatarFallback>
              <UserRound color="#666666" className="h-14 w-14" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col w-full">
            <div className="flex flex-row items-center justify-between w-full">
              <span className="text-md md:text-3xl flex">
                {!isLoading ? (
                  <span>{data?.data?.username}</span>
                ) : (
                  <span>username loading</span>
                )}
              </span>
              {data?.data?.id === userAuth?.id && (
                <EditProfileDialog
                  userId={data?.data?.id}
                  isLoading={isLoading}
                  data={data}
                  isError={isError}
                />
              )}
            </div>
            <div className="text-xs md:text-xl flex text-[#818181]">
              {!isLoading ? (
                <span>{data?.data?.description}</span>
              ) : (
                <span>description loading</span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-10 flex items-center max-w-7xl w-full">
          <ToggleGroup
            type="single"
            className="flex flex-wrap items-center gap-3"
            defaultValue={selectedTab}
            onValueChange={(key) => changeToggleValue(key)}
          >
            {pageTabs.map((item, index) => {
              const id = String(index + 1);
              return (
                <ToggleGroupItem
                  className="p-2 text-xs sm:text-base"
                  value={item.name}
                  key={id}
                >
                  {item.name}
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-7xl p-4 md:p-10 items-center w-full mx-auto">
        <div className="flex flex-col gap-2 items-start w-full ">
          <h2 className="font-bold mb-2 md:mb-4 text-md md:text-3xl">
            Artworks
          </h2>
        </div>
        <div className="w-full h-8 bg-red-200 ">{`mga artworks (remove bg-red and h-8 in className)`}</div>
      </div>
    </div>
  );
};

export default ProfilePage;
