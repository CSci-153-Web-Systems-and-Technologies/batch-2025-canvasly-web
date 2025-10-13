import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Ellipsis, UserRound, PhilippinePeso } from "lucide-react";
import { Button } from "./ui/button";
import dayjs from "dayjs";
import Image from "next/image";
import { getFileTypeFromUrl } from "@/utils";

const PostContainer = ({ data }) => {
  const nameShown =
    data?.author?.username || data?.author?.email || "Anonymous";

  return (
    <div className="w-[335px] sm:w-[490px] md:w-[570px] lg:w-[700px] h-full flex flex-col justify-center gap-2">
      <div className="flex flex-row justify-between items-center  w-full">
        <div className="flex flex-row items-center gap-2">
          <Avatar>
            <AvatarImage alt="@user" />
            <AvatarFallback>
              <UserRound color="#666666" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span>{nameShown}</span>
            <span className="text-xs font-semibold text-[#666666]">
              {dayjs(data?.createdAt).format("DD MMM YYYY")}
            </span>
          </div>
        </div>
        <Button
          src={data?.author?.image_post_url}
          variant="ghost"
          className="rounded-full p-2.5"
        >
          <Ellipsis color="#333333" />
        </Button>
      </div>
      <div className="flex justify-center w-full ">
        {getFileTypeFromUrl(data?.image_post_url) === "image" && (
          <div className="relative w-full h-[360px] sm:h-[490px] md:h-[570px] lg:h-[700px] rounded-lg overflow-hidden bg-[#dedede]">
            <Image
              // A more descriptive alt tag is better for accessibility
              alt={data?.title || "Post image"}
              src={data?.image_post_url}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain"
            />
          </div>
        )}

        {getFileTypeFromUrl(data?.image_post_url) === "video" && (
          <div className="relative w-full h-[360px] sm:h-[490px] md:h-[570px] lg:h-[700px] rounded-lg overflow-hidden bg-[#dedede]">
            <video
              src={data?.image_post_url}
              controls
              className="object-contain"
            />
          </div>
        )}
      </div>
      <div className="flex flex-row justify-between w-full">
        <span className="text-base md:text-xl">{`(like button)`}</span>
        <div className="flex flex-riw justify-center gap-1 md:gap-4 text-base md:text-xl text-[#666666]">
          <p>{data?.art_type}</p>
          {(data?.price || data?.price > 0) && (
            <div className="flex flex-row justify-center gap-0">
              <PhilippinePeso color="#666666" />
              <p className="flex ">{data?.price}</p>
            </div>
          )}
        </div>
      </div>
      <div className="w-full">
        <p className="text-base md:text-xl font-semibold">{data?.title}</p>
      </div>
      <div className="w-full text-sm md:text-base">
        <p>{data?.post_description}</p>
      </div>
      <div className="flex justify-center w-full">
        <p>comments</p>
      </div>
    </div>
  );
};

export default PostContainer;
