"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { UserRound } from "lucide-react";
import dayjs from "dayjs";
import { useSafeNavigate } from "@/utils/safeNavigate";

interface PostAuthorInfoProps {
  author: {
    id: string;
    username?: string;
    email?: string;
    image_url?: string;
  };
  createdAt: string;
}

const PostAuthorInfo: React.FC<PostAuthorInfoProps> = ({
  author,
  createdAt,
}) => {
  const { safeNavigate } = useSafeNavigate();
  const nameShown = author.username || author.email || "Anonymous";

  const handleNavigate = async () => {
    await safeNavigate(`/users/${author.id}?person=${author.username}`);
  };

  return (
    <div className="flex flex-row justify-between items-center w-full">
      <div className="flex flex-row justify-center gap-2">
        <div className="cursor-pointer" onClick={handleNavigate}>
          <Avatar>
            <AvatarImage
              className="object-cover"
              src={author.image_url}
              alt="@user"
            />
            <AvatarFallback>
              <UserRound color="#666666" />
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-col cursor-pointer" onClick={handleNavigate}>
          <span className="font-semibold text-sm md:text-base">
            {nameShown}
          </span>
          <span className="text-xs font-semibold text-[#666666]">
            {dayjs(createdAt).format("DD MMM YYYY")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostAuthorInfo;
