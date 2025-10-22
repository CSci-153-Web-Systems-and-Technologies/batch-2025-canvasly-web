"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useQueryClient } from "@tanstack/react-query";
import { UserRound } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

const UserBox = ({ currentUser, data, type, loggedInUserData }) => {
  const [followed, setFollowed] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (
      loggedInUserData?.following
        ?.map((person) => person?.followingId)
        .includes(data?.[type === "follower" ? "followerId" : "followingId"])
    ) {
      setFollowed(true);
    } else {
      setFollowed(false);
    }
  }, [loggedInUserData, data, setFollowed, type]);

  return (
    <div className="flex flex-row items-center justify-between w-full">
      <div className="flex flex-row items-center gap-3">
        <div>
          <Avatar>
            <AvatarImage
              className="h-9 w-9 rounded-full object-cover"
              src={data?.[type]?.image_url}
              alt="@user"
            />
            <AvatarFallback>
              <UserRound color="#666666" className="h-9 w-9 rounded-full" />
            </AvatarFallback>
          </Avatar>
        </div>
        <span className="text-black text-base">{data?.[type]?.username}</span>
      </div>

      {!followed ? <Button>Follow</Button> : <Button>Unfollow</Button>}
    </div>
  );
};

export default UserBox;
