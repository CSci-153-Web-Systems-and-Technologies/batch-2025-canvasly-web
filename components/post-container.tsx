import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { UserRound, PhilippinePeso } from "lucide-react";
import dayjs from "dayjs";
import Image from "next/image";
import { getFileTypeFromUrl } from "@/utils";
//import HeartIcon from "./ui/heart-icon";
import HeartContainer from "./heart-container";
import CommentSection from "./comment-section";
import Link from "next/link";
//import { Button } from "./ui/button";

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
            <Link
              passHref
              href={`/users/${data?.author?.id}?person=${data?.author?.username}`}
            >
              <span className="font-semibold text-sm md:text-base">
                {nameShown}
              </span>
            </Link>
            <span className="text-xs font-semibold text-[#666666]">
              {dayjs(data?.createdAt).format("DD MMM YYYY")}
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full">
        {getFileTypeFromUrl(data?.image_post_url) === "image" && (
          <div className="relative w-full h-[360px] sm:h-[490px] md:h-[420px] lg:h-[620px] xl:h-[700px] rounded-lg overflow-hidden bg-[#f5f5f5]">
            <Link href={`/posts/${data?.id}`}>
              <Image
                alt={data?.title || "Post image"}
                src={data?.image_post_url}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain"
              />
            </Link>
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

        <div className="flex flex-row items-center gap-4 text-base md:text-xl text-[#666666]">
          {/* Always render art type */}
          <p>{data?.art_type}</p>

          {/* Render price if it exists, but don't affect art_type */}
          {data?.price !== undefined && data?.price !== null && (
            <div className="flex flex-row items-center gap-1">
              <PhilippinePeso color="#666666" />
              <p className="truncate max-w-20">{data.price}</p>
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
