"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserRound } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { updateFollow } from "@/actions/user";
import toast from "react-hot-toast";
import Link from "next/link";
import { useSafeNavigate } from "@/utils/safeNavigate";

const UserBox = ({ currentUser, data, type, loggedInUserData }) => {
  const { safeNavigate } = useSafeNavigate();
  const personId = data?.[type]?.id;

  const isFollowed = loggedInUserData?.following?.some(
    (person) => person.followingId === personId
  );

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateFollow,
    onMutate: async (params) => {
      await queryClient.cancelQueries({
        queryKey: ["user", currentUser?.id, "followInfo"],
      });
      await queryClient.cancelQueries({
        queryKey: ["user", personId, "followInfo"],
      });
      await queryClient.cancelQueries({
        queryKey: ["user", "followSuggestions"],
      });

      const previousData = queryClient.getQueryData([
        "user",
        currentUser?.id,
        "followInfo",
      ]);

      queryClient.setQueryData(
        ["user", currentUser?.id, "followInfo"],
        (old) => {
          if (!old) return { following: [] };

          const newData = {
            ...old,
            following:
              params?.type === "follow"
                ? [
                    ...(old.following || []),
                    {
                      followingId: params.id,
                      followerId: currentUser?.id,
                      following: data[type],
                    },
                  ]
                : (old.following || []).filter(
                    (person) => person.followingId !== params.id
                  ),
          };
          return newData;
        }
      );

      queryClient.setQueryData(["user", "followSuggestions"], (old) => {
        if (!old) return [];
        return old.filter((person) => person.id !== params.id);
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      toast.error("Something went wrong. Try again!");
      console.error("Follow mutation error:", err);
      queryClient.setQueryData(
        ["user", currentUser?.id, "followInfo"],
        context?.previousData
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", currentUser?.id, "followInfo"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user", personId, "followInfo"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user", "followSuggestions"],
      });
    },
  });

  return (
    <div className="flex flex-row items-center justify-between w-full">
      <Link
        href={`/users/${data?.[type]?.id}?person=${data?.[type]?.username}`}
        className="flex flex-row items-center gap-3 cursor-pointer"
        onClick={async (e) => {
          e.preventDefault();
          await safeNavigate(
            `/users/${data?.[type]?.id}?person=${data?.[type]?.username}`
          );
        }}
      >
        <Avatar className="h-9 w-9 flex-shrink-0">
          <AvatarImage
            className="h-9 w-9 rounded-full object-cover"
            src={data?.[type]?.image_url}
            alt="@user"
          />
          <AvatarFallback>
            <UserRound color="#666666" className="h-9 w-9 rounded-full" />
          </AvatarFallback>
        </Avatar>

        <p className=" text-black text-base break-words break-all line-clamp-1 pr-5 ">
          {data?.[type]?.username}
        </p>
      </Link>

      {!isFollowed ? (
        <Button
          onClick={() => mutate({ id: personId, type: "follow" })}
          disabled={isPending}
        >
          {isPending ? "Loading..." : "Follow"}
        </Button>
      ) : (
        <Button
          className="bg-[#E0DFDB]"
          variant="outline"
          onClick={() => mutate({ id: personId, type: "unfollow" })}
          disabled={isPending}
        >
          {isPending ? "Loading..." : "Following"}
        </Button>
      )}
    </div>
  );
};

export default UserBox;
