"use client";

import React from "react";
import { PhilippinePeso } from "lucide-react";
import HeartContainer from "./heart-container";
import CommentSection from "./comment-section";
import PostAuthorInfo from "./post-author-info";
import PostMedia from "./post-media";

const PostContainer = ({ data, queryId }) => {
  return (
    <div className="w-[335px] sm:w-[490px] md:w-[420px] lg:w-[620px] xl:w-[700px] h-full flex flex-col justify-center gap-2">
      <PostAuthorInfo author={data?.author} createdAt={data?.createdAt} />
      <PostMedia
        postId={data?.id}
        title={data?.title}
        mediaUrl={data?.image_post_url}
      />

      {/* Likes, Art Type, Price */}
      <div className="flex flex-row justify-between items-center w-full">
        <HeartContainer
          postId={data?.id}
          likes={data?.likes}
          queryId={queryId}
        />

        <div className="flex flex-row items-center gap-4 text-base md:text-xl text-[#666666]">
          <p>{data?.art_type}</p>
          {data?.price !== undefined && data?.price !== null && (
            <div className="flex flex-row items-center gap-1">
              <PhilippinePeso color="#666666" />
              <p className="truncate max-w-20">{data.price}</p>
            </div>
          )}
        </div>
      </div>

      {/* Title & Description */}
      <div className="w-full">
        <p className="text-base md:text-xl font-semibold">{data?.title}</p>
      </div>
      <div className="w-full text-sm md:text-base">
        <p>{data?.post_description}</p>
      </div>

      {/* Comments */}
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
