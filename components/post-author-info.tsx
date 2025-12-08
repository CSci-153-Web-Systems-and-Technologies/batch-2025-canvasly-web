"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { UserRound } from "lucide-react";
import dayjs from "dayjs";
import { SafeLink } from "./safe-link";

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
  const nameShown = author.username || author.email || "Anonymous";
  const url = `/users/${author.id}?person=${author.username}`;

  return (
    <div className="flex flex-row justify-between items-center w-full">
      <div className="flex flex-row justify-center gap-2">
        <SafeLink href={url}>
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
        </SafeLink>

        <div className="flex flex-col items-start justify-start w-20">
          <SafeLink href={url}>
            <p className="font-semibold text-sm md:text-base truncate max-w-56">
              {nameShown}
            </p>
          </SafeLink>
          <span className="text-xs font-semibold text-[#666666]">
            {dayjs(createdAt).format("DD MMM YYYY")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostAuthorInfo;
