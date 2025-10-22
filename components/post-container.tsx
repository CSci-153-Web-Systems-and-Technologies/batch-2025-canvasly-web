import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Ellipsis, UserRound, PhilippinePeso } from "lucide-react";
import { Button } from "./ui/button";
import dayjs from "dayjs";
import Image from "next/image";
import { getFileTypeFromUrl } from "@/utils";
//import HeartIcon from "./ui/heart-icon";
import HeartContainer from "./heart-container";
import CommentSection from "./comment-section";
import Link from "next/link";

const PostContainer = ({ data, queryId }) => {
  console.log("POST CONTAINER", data);

  const nameShown =
    data?.author?.username || data?.author?.email || "Anonymous";

  return (
    <div className="w-[335px] sm:w-[490px] md:w-[420px] lg:w-[620px] xl:w-[700px] h-full flex flex-col justify-center gap-2">
      <div className="flex flex-row justify-between items-center  w-full">
        <div className="flex flex-row justify-center gap-2">
          <Link
            passHref
            href={`/users/${data?.author?.id}?person=${data?.author?.username}`}
          >
            <Avatar>
              <AvatarImage
                className="object-cover"
                src={data?.author?.image_url}
                alt="@user"
              />
              <AvatarFallback>
                <UserRound color="#666666" />
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex flex-col">
            <span>{nameShown}</span>
            <span className="text-xs font-semibold text-[#666666]">
              {dayjs(data?.createdAt).format("DD MMM YYYY")}
            </span>
          </div>
        </div>
        <Button variant="ghost" className="rounded-full p-2.5">
          <Ellipsis color="#333333" />
        </Button>
      </div>
      <div className="flex justify-center w-full">
        {getFileTypeFromUrl(data?.image_post_url) === "image" && (
          <div className="relative w-full h-[360px] sm:h-[490px] md:h-[420px] lg:h-[620px] xl:h-[700px] rounded-lg overflow-hidden bg-[#f5f5f5]">
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
          <div className="relative w-full h-[360px] sm:h-[490px] md:h-[420px] lg:h-[620px] xl:h-[700px] rounded-lg overflow-hidden bg-[#f5f5f5]">
            <video
              src={data?.image_post_url}
              controls
              className="object-contain"
            />
          </div>
        )}
      </div>
      <div className="flex flex-row justify-between items-center w-full">
        <HeartContainer
          postId={data?.id}
          likes={data?.likes}
          queryId={queryId}
        />

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
        <CommentSection
          comments={data?.comments}
          postId={data?.id}
          queryId={data?.queryId}
        />
      </div>
    </div>
  );
};

export default PostContainer;
