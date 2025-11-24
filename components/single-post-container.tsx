"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { UserRound, PhilippinePeso, Pencil } from "lucide-react";
import { Button } from "./ui/button";
import dayjs from "dayjs";
import Image from "next/image";
import { getFileTypeFromUrl } from "@/utils";
import HeartContainer from "./heart-container";
import CommentSection from "./comment-section";
import Link from "next/link";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updatePostLike } from "@/actions/post";

const SinglePostContainer = ({ data, authUser, queryId }: any) => {
  const queryClient = useQueryClient();
  const postId = data?.id;
  const isOwner = authUser?.id === data?.author?.id;
  const nameShown =
    data?.author?.username || data?.author?.email || "Anonymous";

  // Optimistic mutation for likes
  const likeMutation = useMutation({
    mutationFn: ({ actionType }: { actionType: "like" | "unlike" }) =>
      updatePostLike({ postId, actionType }),
    onMutate: async ({ actionType }) => {
      await queryClient.cancelQueries([queryId]);
      const previousData = queryClient.getQueryData([queryId]);

      queryClient.setQueryData([queryId], (old: any) => {
        if (!old) return old;

        const alreadyLiked = old.likes.some(
          (like: any) => like.authorId === authUser?.id
        );

        let newLikes = [...old.likes];
        if (actionType === "like" && !alreadyLiked) {
          newLikes.push({ id: Date.now(), authorId: authUser?.id });
        }
        if (actionType === "unlike" && alreadyLiked) {
          newLikes = newLikes.filter(
            (like: any) => like.authorId !== authUser?.id
          );
        }

        return { ...old, likes: newLikes };
      });

      return { previousData };
    },
    onError: (_, __, context) => {
      if (context?.previousData)
        queryClient.setQueryData([queryId], context.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries([queryId]);
    },
  });

  return (
    <div className="w-[335px] sm:w-[490px] md:w-[420px] lg:w-[620px] xl:w-[700px] h-full flex flex-col justify-center gap-2">
      {/* Header */}
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-row justify-center gap-2">
          <Link
            passHref
            href={`/users/${data?.author?.id}?person=${data?.author?.username}`}
          >
            <Avatar>
              <AvatarImage
                className="object-cover"
                src={data?.author?.image_url || null} // <-- fallback to null
                alt="@user"
              />

              <AvatarFallback>
                <UserRound color="#666666" />
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex flex-col">
            <span className="font-semibold text-sm md:text-base">
              {nameShown}
            </span>
            <span className="text-xs font-semibold text-[#666666]">
              {dayjs(data?.createdAt).format("DD MMM YYYY")}
            </span>
          </div>
        </div>

        {isOwner && (
          <Link passHref href={`/edit/${data?.id}`}>
            <Button variant="ghost" className="rounded-full p-2.5">
              <Pencil color="#333333" />
            </Button>
          </Link>
        )}
      </div>

      {/* Media */}
      <div className="flex justify-center w-full">
        {getFileTypeFromUrl(data?.image_post_url) === "image" && (
          <div className="relative w-full h-[360px] sm:h-[490px] md:h-[420px] lg:h-[620px] xl:h-[700px] rounded-lg overflow-hidden bg-[#f5f5f5]">
            <Image
              alt={data?.title || "Post image"}
              src={data?.image_post_url}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        )}

        {getFileTypeFromUrl(data?.image_post_url) === "video" && (
          <div className="relative w-full h-[360px] sm:h-[490px] md:h-[420px] lg:h-[620px] xl:h-[700px] rounded-lg overflow-hidden bg-[#f5f5f5]">
            <video
              src={data?.image_post_url}
              controls
              className="object-contain w-full h-full"
            />
          </div>
        )}
      </div>

      {/* Likes & price */}
      <div className="flex flex-row justify-between items-center w-full">
        <HeartContainer
          postId={postId}
          likes={data?.likes}
          authUser={authUser}
          onToggle={(liked: boolean) =>
            likeMutation.mutate({ actionType: liked ? "like" : "unlike" })
          }
        />

        <div className="flex flex-row justify-center gap-1 md:gap-4 text-base md:text-xl text-[#666666]">
          <p>{data?.art_type}</p>
          {(data?.price || data?.price > 0) && (
            <div className="flex flex-row items-center gap-1">
              <PhilippinePeso color="#666666" />
              <p>{data?.price}</p>
            </div>
          )}
        </div>
      </div>

      {/* Title & description */}
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
          postId={postId}
          queryId={queryId}
        />
      </div>
    </div>
  );
};

export default SinglePostContainer;
