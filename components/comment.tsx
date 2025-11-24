import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserRound } from "lucide-react";
import dayjs from "dayjs";
import Link from "next/link";
import EllipsisButton from "./ellipsis-button";

const Comment = ({ data, onEdit, onDelete }) => {
  const displayName =
    data?.author?.username || data?.author?.email || "Anonymous";

  return (
    <div className="flex flex-row w-full gap-2 p-1 relative">
      <Link
        passHref
        href={`/users/${data?.author?.id}?person=${data?.author?.username}`}
      >
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
      </Link>

      <div className="flex flex-col w-full gap-1 bg-[#f5f5f5] rounded-xl p-3">
        <div className="flex flex-row justify-between items-center w-full font-semibold text-sm md:text-base">
          <span>{displayName}</span>
          <span className="text-xs font-normal md:font-semibold text-[#666666]">
            {dayjs(data?.createdAt).format("DD MMM YYYY")}
          </span>
        </div>

        <span className="text-[#333333] text-sm md:text-base">
          {data?.comment}
        </span>
      </div>

      <EllipsisButton
        dataAuthor={data?.author?.id}
        onEdit={() => onEdit?.(data.id, data.comment)}
        onDelete={() => onDelete?.(data.id)}
      />
    </div>
  );
};

export default Comment;
