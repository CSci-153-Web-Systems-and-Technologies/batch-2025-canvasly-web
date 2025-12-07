"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getFileTypeFromUrl } from "@/utils";
import { useSafeNavigate } from "@/utils/safeNavigate";

interface PostMediaProps {
  postId: string;
  title?: string;
  mediaUrl?: string;
}

const PostMedia: React.FC<PostMediaProps> = ({ postId, title, mediaUrl }) => {
  const { safeNavigate } = useSafeNavigate();
  const url = `/posts/${postId}`;
  const fileType = getFileTypeFromUrl(mediaUrl);

  const handleClick = async (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    await safeNavigate(url);
  };

  if (fileType === "video") {
    return (
      <div className="relative w-full h-[360px] sm:h-[490px] md:h-[420px] lg:h-[620px] xl:h-[700px] rounded-lg overflow-hidden bg-[#f5f5f5]">
        <video src={mediaUrl} controls className="object-contain" />
      </div>
    );
  }

  return (
    <Link
      href={url}
      onClick={handleClick}
      className="relative w-full h-[360px] sm:h-[490px] md:h-[420px] lg:h-[620px] xl:h-[700px] rounded-lg overflow-hidden bg-[#f5f5f5] cursor-pointer"
    >
      <Image
        alt={title || "Post image"}
        src={mediaUrl || "/CanvaslyLogo.png"}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-contain"
      />
    </Link>
  );
};

export default PostMedia;
