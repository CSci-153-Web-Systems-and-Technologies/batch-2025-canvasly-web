import React from "react";
//import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
//import { UserRound } from "lucide-react";

import Image from "next/image";
import { getFileTypeFromUrl } from "@/utils";
import Link from "next/link";
//import HeartIcon from "./ui/heart-icon";

const ArtworkContainer = ({ data }) => {
  return (
    <div className="flex w-[160px] sm:w-[140px] md:w-[160px] lg:w-[210px] xl:w-[280px] h-full flex-col  gap-2 ">
      <div className="flex justify-center w-full">
        {getFileTypeFromUrl(data?.image_post_url) === "image" && (
          <div className="relative w-full h-[160px] sm:h-[140px] md:h-[160px] lg:h-[210px] xl:h-[280px] rounded-lg overflow-hidden bg-[#dedede]">
            <Link href={`/posts/${data?.id}`}>
              <Image
                // A more descriptive alt tag is better for accessibility
                alt={data?.title || "Post image"}
                src={data?.image_post_url}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="object-cover"
              />
            </Link>
          </div>
        )}
        {getFileTypeFromUrl(data?.image_post_url) === "video" && (
          <div className="relative w-full h-[160px] sm:h-[140px] md:h-[160px] lg:h-[210px] xl:h-[280px] rounded-lg overflow-hidden bg-[#dedede]">
            <video
              src={data?.image_post_url}
              controls
              className="object-cover"
            />
          </div>
        )}
      </div>
      <div className="w-full">
        <p className="text-base md:text-xl truncate">{data?.title}</p>
      </div>
    </div>
  );
};

export default ArtworkContainer;
