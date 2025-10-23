"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserRound } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { updateFollow } from "@/actions/user";
import toast from "react-hot-toast";
import Link from "next/link";

// 1. Accept the new 'loggedInUserId' prop
const UserFollowBox = ({
  loggedInUserFollowInfo,
  data,
  userObjectKey,
  loggedInUserId,
}) => {
  const queryClient = useQueryClient();

  const person = data?.[userObjectKey];
  const personId = person?.id;

  // 2. Use the 'loggedInUserId' prop for a reliable 'isMe' check
  const isMe = personId && loggedInUserId && personId === loggedInUserId;

  const isFollowed = loggedInUserFollowInfo?.following?.some(
    (p) => p.followingId === personId
  );

  const { mutate, isPending } = useMutation({
    mutationFn: updateFollow,
    onMutate: async (params) => {
      // 3. Use 'loggedInUserId' prop inside the mutation (it's more reliable)
      await queryClient.cancelQueries({
        queryKey: ["user", loggedInUserId, "followInfo"],
      });
      await queryClient.cancelQueries({
        queryKey: ["user", personId, "followInfo"],
      });
      await queryClient.cancelQueries({
        queryKey: ["user", "followSuggestions"],
      });

      const previousData = queryClient.getQueryData([
        "user",
        loggedInUserId,
        "followInfo",
      ]);

      queryClient.setQueryData(
        ["user", loggedInUserId, "followInfo"],
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
                      followerId: loggedInUserId, // Use prop here
                      following: person,
                    },
                  ]
                : (old.following || []).filter(
                    (p) => p.followingId !== params.id
                  ),
          };
          return newData;
        }
      );

      queryClient.setQueryData(["user", "followSuggestions"], (old) => {
        if (!old) return [];
        return old.filter((p) => p.id !== params.id);
      });

      return { previousData };
    },

    onError: (err, variables, context) => {
      toast.error("Something went wrong. Try again!");
      console.error("Follow mutation error:", err);
      // 4. Use 'loggedInUserId' prop for rollback
      queryClient.setQueryData(
        ["user", loggedInUserId, "followInfo"],
        context?.previousData
      );
    },

    onSettled: () => {
      // 5. Use 'loggedInUserId' prop for invalidation
      queryClient.invalidateQueries({
        queryKey: ["user", loggedInUserId, "followInfo"],
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
    <div className="flex flex-row items-center justify-between w-full p-1 sm:p-4">
      <Link passHref href={`/users/${person?.id}?person=${person?.username}`}>
        <div className="flex flex-row items-center gap-3">
          <Avatar>
            <AvatarImage
              className="h-10 w-10 sm:h-14 sm:w-14 rounded-full object-cover"
              src={person?.image_url}
              alt="@user"
            />
            <AvatarFallback>
              <UserRound
                color="#666666"
                className="h-10 w-10 sm:h-14 sm:w-14  rounded-full"
              />
            </AvatarFallback>
          </Avatar>
          <span className="text-black text-base">{person?.username}</span>
        </div>
      </Link>

      {/* This JSX is unchanged, but 'isMe' is now correct */}
      {loggedInUserId && !isMe && (
        <>
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
        </>
      )}
    </div>
  );
};

export default UserFollowBox;
//UserFollowBox
