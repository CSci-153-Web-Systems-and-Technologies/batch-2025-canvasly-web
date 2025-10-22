"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserRound } from "lucide-react";
// 1. REMOVED useState and useEffect
import React from "react";
import { Button } from "./ui/button";
import { updateFollow } from "@/actions/user";
import toast from "react-hot-toast";

const UserBox = ({ currentUser, data, type, loggedInUserData }) => {
  // 2. REMOVED: const [followed, setFollowed] = useState(false);
  const personId = data?.[type]?.id;

  // 3. DERIVED STATE: Calculate 'isFollowed' directly from the prop.
  // This is the key fix. This variable is now 100% in sync with the cache.
  const isFollowed = loggedInUserData?.following?.some(
    (person) => person.followingId === personId
  );

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateFollow,
    onMutate: async (params) => {
      // Cancel queries (v5 object syntax)
      await queryClient.cancelQueries({
        queryKey: ["user", currentUser?.id, "followInfo"],
      });
      await queryClient.cancelQueries({
        queryKey: ["user", personId, "followInfo"],
      });
      await queryClient.cancelQueries({
        queryKey: ["user", "followSuggestions"],
      });

      // 4. FIXED: Use getQueryData (singular) to get the snapshot
      const previousData = queryClient.getQueryData([
        "user",
        currentUser?.id,
        "followInfo",
      ]);

      // Optimistically update the user's follow list
      queryClient.setQueryData(
        ["user", currentUser?.id, "followInfo"],
        (old) => {
          // Add a guard for an empty cache
          if (!old) return { following: [] };

          const newData = {
            ...old,
            following:
              params?.type === "follow"
                ? [
                    ...(old.following || []), // Ensure 'following' is an array
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

      // This part for follow suggestions is correct!
      queryClient.setQueryData(["user", "followSuggestions"], (old) => {
        if (!old) return [];
        return old.filter((person) => person.id !== params.id);
      });

      return { previousData };
    },

    onError: (err, variables, context) => {
      toast.error("Something went wrong. Try again!");
      console.error("Follow mutation error:", err);
      // Rollback
      queryClient.setQueryData(
        ["user", currentUser?.id, "followInfo"],
        context?.previousData
      );
    },

    onSettled: () => {
      // Re-fetch after the mutation settles (v5 object syntax)
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

  // 5. REMOVED: The useEffect is no longer needed.

  return (
    <div className="flex flex-row items-center justify-between w-full">
      <div className="flex flex-row items-center gap-3">
        <div>
          <Avatar>
            <AvatarImage
              className="h-9 w-9 rounded-full object-cover"
              src={data?.[type]?.image_url}
              alt="@user"
            />
            <AvatarFallback>
              <UserRound color="#666666" className="h-9 w-9 rounded-full" />
            </AvatarFallback>
          </Avatar>
        </div>
        <span className="text-black text-base">{data?.[type]?.username}</span>
      </div>

      {/* 6. FIXED: Use the 'isFollowed' derived variable */}
      {!isFollowed ? (
        <Button
          onClick={() => mutate({ id: personId, type: "follow" })}
          disabled={isPending} // Add disabled state
        >
          {isPending ? "Loading..." : "Follow"}
        </Button>
      ) : (
        <Button
          className="bg-[#E0DFDB]"
          variant="outline" // Good to use a different style
          onClick={() => mutate({ id: personId, type: "unfollow" })}
          disabled={isPending} // Add disabled state
        >
          {isPending ? "Loading..." : "Following"}
        </Button>
      )}
    </div>
  );
};

export default UserBox;
