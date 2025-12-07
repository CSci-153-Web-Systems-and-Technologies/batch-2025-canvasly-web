"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { UserRound } from "lucide-react";
import dayjs from "dayjs";
import Link from "next/link";
import { useSafeNavigate } from "@/utils/safeNavigate";
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
  const { safeNavigate } = useSafeNavigate();
  const nameShown = author.username || author.email || "Anonymous";
  const url = `/users/${author.id}?person=${author.username}`;

  const handleClick = async (e: React.MouseEvent) => {
    // ignore if user wants new tab / cmd / ctrl click
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    await safeNavigate(url);
  };

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

        <div className="flex flex-col items-start justify-start">
          <SafeLink href={url}>
            <span className="font-semibold text-sm md:text-base">
              {nameShown}
            </span>
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
