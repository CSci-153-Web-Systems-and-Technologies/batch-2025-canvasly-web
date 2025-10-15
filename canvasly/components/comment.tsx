import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserRound } from "lucide-react";
import dayjs from "dayjs";

const Comment = ({ data }) => {
  const [hasUser, setHasUser] = useState(false);

  return (
    <div className="flex flex-row w-full gap-2 p-1">
      <Avatar>
        <AvatarImage src={data?.author?.image_url ?? null} alt="@poster" />
        <AvatarFallback>
          <UserRound color="#666666" />
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col w-full gap-1 bg-[#efefef] rounded-xl p-3">
        <div className="flex flex-row justify-between items-center w-full font-semibold md:font-bold text-sm md:text-base">
          {data.author.username && setHasUser(false)}
          {hasUser ? (
            <span>{`${data?.author?.username}`}</span>
          ) : (
            <span>{`${data?.author?.email}`}</span>
          )}
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
