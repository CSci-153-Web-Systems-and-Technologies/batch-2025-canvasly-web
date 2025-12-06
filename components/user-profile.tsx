"use client";

import React, { useState } from "react";
import EditProfileDialog from "@/components/edit-profile-dialog";
import { User } from "@supabase/supabase-js"; // Keep this type
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import { pageTabs } from "@/lib/constants";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import FollowInfo from "@/components/follow-info";
import ProfileArtworks from "@/components/profile-artworks";
import FollowButton from "@/components/follow-button";
import FollowPersonsBody from "./follow-persons-body";
import { UserType } from "@/types";

type UserProfileProps = {
  profileUser: UserType; // Use a more specific type from your DB if available
  authUser: User | null;
};

const UserProfile = ({ profileUser, authUser }: UserProfileProps) => {
  const [selectedTab, setSelectedTab] = useState("Artworks");

  const isOwner =
    profileUser?.id && authUser?.id && profileUser.id === authUser.id;

  return (
    <div className="w-full flex flex-col pt-16 md:pt-24">
      <div className="w-full flex flex-col items-center">
        <div className="flex flex-col md:items-center w-full p-4 sm:p-8 bg-[#f5f5f5]">
          <div className="flex flex-row gap-2 sm:gap-4 max-w-7xl w-full">
            <Avatar className="h-20 w-20 reltive">
              <AvatarImage
                className="object-cover"
                src={profileUser?.image_url}
                alt="@user"
              />
              <AvatarFallback>
                <UserRound color="#666666" className="h-14 w-14" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col w-full">
              <div className="flex flex-row items-center justify-between w-full">
                <span className="text-md md:text-3xl flex">
                  <span>{profileUser?.username}</span>
                </span>

                {isOwner && <EditProfileDialog data={{ data: profileUser }} />}
                {!isOwner && profileUser?.id && (
                  <FollowButton id={profileUser.id} />
                )}
              </div>

              <FollowInfo userId={profileUser?.id} />

              <div className="text-xs md:text-xl flex text-[#818181] py-8">
                <span>{profileUser?.description}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center max-w-7xl w-full">
            <ToggleGroup
              type="single"
              className="flex flex-wrap items-center gap-0 md:gap-3"
              value={selectedTab} // controlled
              onValueChange={(key) => {
                if (key) setSelectedTab(key); // only update if key exists
              }}
            >
              {pageTabs.map((item, index) => (
                <ToggleGroupItem
                  className="py-1 text-sm sm:text-base flex-1 text-center"
                  value={item.name}
                  key={index}
                  size="lg"
                >
                  {item.name}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
        {selectedTab === "Artworks" && (
          <div className="flex-1 flex flex-col max-w-7xl p-4 md:p-10 items-center w-full mx-auto">
            <div className="flex flex-col gap-2 items-start w-full ">
              <h2 className="font-bold mb-2 md:mb-4 text-md md:text-3xl">
                Artworks
              </h2>
            </div>
            <div className="w-full">
              <ProfileArtworks id={profileUser?.id} />
            </div>
          </div>
        )}
        {selectedTab === "Followers" && (
          <div className="flex-1 flex flex-col max-w-7xl mb-20 p-4 md:p-10 items-center w-full mx-auto">
            <div className="flex flex-col gap-2 items-start w-full ">
              <h2 className="font-bold mb-2 md:mb-4 text-md md:text-3xl">
                Followers
              </h2>
            </div>
            <div className="w-full">
              <FollowPersonsBody type="followers" id={profileUser?.id} />
            </div>
          </div>
        )}
        {selectedTab === "Followings" && (
          <div className="flex-1 flex flex-col max-w-7xl mb-20 p-4 md:p-10 items-center w-full mx-auto">
            <div className="flex flex-col gap-2 items-start w-full ">
              <h2 className="font-bold mb-2 md:mb-4 text-md md:text-3xl">
                Followings
              </h2>
            </div>
            <div className="w-full">
              <FollowPersonsBody type="following" id={profileUser?.id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
