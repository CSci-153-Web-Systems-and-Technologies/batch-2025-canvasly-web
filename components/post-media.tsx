"use client";

import React from "react";
import Image from "next/image";
import { getFileTypeFromUrl } from "@/utils";
import { useSafeNavigate } from "@/utils/safeNavigate";

interface PostMediaProps {
  postId: string;
  title?: string;
  mediaUrl?: string;
}

const PostMedia: React.FC<PostMediaProps> = ({ postId, title, mediaUrl }) => {
  const { safeNavigate } = useSafeNavigate();
  const fileType = getFileTypeFromUrl(mediaUrl);

  const handleNavigate = async () => {
    await safeNavigate(`/posts/${postId}`);
  };

  if (fileType === "video") {
    return (
      <div className="relative w-full h-[360px] sm:h-[490px] md:h-[420px] lg:h-[620px] xl:h-[700px] rounded-lg overflow-hidden bg-[#f5f5f5]">
        <video src={mediaUrl} controls className="object-contain" />
      </div>
    );
  }

  // Default to image
  return (
    <div
      className="relative w-full h-[360px] sm:h-[490px] md:h-[420px] lg:h-[620px] xl:h-[700px] rounded-lg overflow-hidden bg-[#f5f5f5] cursor-pointer"
      onClick={handleNavigate}
    >
      <Image
        alt={title || "Post image"}
        src={mediaUrl || "/CanvaslyLogo.png"}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-contain"
      />
    </div>
  );
};

export default PostMedia;
