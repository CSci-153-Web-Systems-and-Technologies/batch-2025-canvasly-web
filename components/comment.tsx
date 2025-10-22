import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserRound } from "lucide-react";
import dayjs from "dayjs";

const Comment = ({ data }) => {
  // Determine the name to show directly from props. No state needed!
  // If username exists, use it. Otherwise, use the email.
  const displayName =
    data?.author?.username || data?.author?.email || "Anonymous";

  return (
    <div className="flex flex-row w-full gap-2 p-1 relative">
      <Avatar>
        <AvatarImage
          className="object-cover"
          src={data?.author?.image_url ?? ""}
          alt="@poster"
        />
        <AvatarFallback>
          <UserRound color="#666666" />
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col w-full gap-1 bg-[#f5f5f5] rounded-xl p-3">
        <div className="flex flex-row justify-between items-center w-full font-semibold md:font-bold text-sm md:text-base">
          {/* Use the derived displayName variable here */}
          <span>{displayName}</span>

          <span className="text-xs font-normal md:font-semibold text-[#666666]">
            {dayjs(data?.createdAt).format("DD MMM YYYY")}
          </span>
        </div>
        <span className="text-[#333333] text-sm md:text-base">
          {data?.comment}
        </span>
      </div>
    </div>
  );
};

export default Comment;
