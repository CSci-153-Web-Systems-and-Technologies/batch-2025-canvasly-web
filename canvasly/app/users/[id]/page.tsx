import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import { AuthUser } from "@/components/auth-username-container";
import EditProfileDialog from "@/components/edit-profile-dialog";

const ProfilePage = () => {
  return (
    <div className="w-full flex flex-col ">
      <div className="flex flex-col md:items-center  w-full p-4 sm:p-8 bg-[#f7f7f7]">
        <div className="flex flex-row gap-1 sm:gap-4 items-center max-w-7xl w-full">
          <Avatar className="md:w-24 md:h-24 w-14 h-14">
            <AvatarImage alt="@user" />
            <AvatarFallback>
              <UserRound
                color="#666666"
                className="md:w-14 md:h-14 w-10 h-10"
              />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col w-full">
            <div className="flex flex-row items-center justify-between w-full">
              <AuthUser classNameString="text-md md:text-3xl flex" />
              <EditProfileDialog />
            </div>
            <div className="text-xs md:text-xl flex text-[#818181]">
              description
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col max-w-7xl p-4 md:p-10 items-center w-full mx-auto">
        <div className="flex flex-col gap-2 items-start w-full ">
          <h2 className="font-bold mb-2 md:mb-4 text-md md:text-3xl">
            Artworks
          </h2>
        </div>
        <div className="w-full h-8 bg-red-200 ">{`mga artworks (remove bg-red and h-8)`}</div>
      </div>
    </div>
  );
};

export default ProfilePage;
