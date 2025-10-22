"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserRound } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
// Make sure this is the correct import
import { getAllFollowersAndFollowingsInfo, updateFollow } from "@/actions/user";
import toast from "react-hot-toast";
import { createClient } from "@/lib/client";
import { User } from "@supabase/supabase-js";
import { Skeleton } from "./ui/skeleton";
import { useQuery } from "@tanstack/react-query"; // Import useQuery

const FollowButton = ({ id }) => {
  const supabase = createClient();
  const [followed, setFollowed] = useState(false);
  const [userAuth, setUserAuth] = useState<User | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error fetching user:", userError);
        return;
      }
      setUserAuth(user);
    };

    fetchAllData();
  }, [supabase]);

  const queryClient = useQueryClient();

  // This query fetches the logged-in user's follow info
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user", userAuth?.id, "followInfo"],
    queryFn: () => getAllFollowersAndFollowingsInfo(userAuth?.id),
    enabled: !!userAuth,
    staleTime: 1000 * 60 * 20,
  });

  // This effect correctly syncs the button state with the query data
  useEffect(() => {
    // 1. FIXED TYPO: .mp -> .map
    if (data?.following?.map((person) => person?.followingId).includes(id)) {
      setFollowed(true);
    } else {
      setFollowed(false);
    }
  }, [data, setFollowed, id, isLoading]);

  const { mutate, isPending } = useMutation({
    mutationFn: updateFollow,
    onMutate: async ({ type }) => {
      // Optimistically update the local state for instant UI feedback
      setFollowed(!followed);

      // 2. FIXED SYNTAX: Use object syntax for v5
      await queryClient.cancelQueries({
        queryKey: ["user", id, "followInfo"],
      });
      await queryClient.cancelQueries({
        queryKey: ["user", userAuth?.id, "followInfo"],
      });

      const snapshotOfCurrentUser = queryClient.getQueryData([
        "user",
        userAuth?.id,
        "followInfo",
      ]);

      const snapshotOfProfileUser = queryClient.getQueryData([
        "user",
        id,
        "followInfo",
      ]);

      // Optimistically update current user's following list
      queryClient.setQueryData(["user", userAuth?.id, "followInfo"], (old) => {
        if (!old) return { following: [], followers: [] }; // Guard
        return {
          ...old,
          following:
            type === "follow"
              ? [...(old.following || []), { followingId: id }]
              : (old.following || []).filter(
                  (person) => person.followingId !== id
                ),
        };
      });

      // Optimistically update profile user's followers list
      queryClient.setQueryData(["user", id, "followInfo"], (old) => {
        if (!old) return { following: [], followers: [] }; // Guard
        return {
          ...old,
          followers:
            type === "follow"
              ? [...(old.followers || []), { followerId: userAuth?.id }]
              : (old.followers || []).filter(
                  (person) => person.followerId !== userAuth?.id
                ),
        };
      });

      return { snapshotOfCurrentUser, snapshotOfProfileUser };
    },

    onError: (err, variables, context) => {
      // Rollback the local state on error
      setFollowed(!followed);

      // Rollback the cache
      queryClient.setQueryData(
        ["user", userAuth?.id, "followInfo"],
        context?.snapshotOfCurrentUser
      );
      queryClient.setQueryData(
        ["user", id, "followInfo"],
        context?.snapshotOfProfileUser
      );

      toast.error("Something wrong happened. Try again!");
      console.error("Follow mutation error:", err);
    },

    onSettled: () => {
      // Re-fetch both queries to ensure sync with server
      queryClient.invalidateQueries({
        queryKey: ["user", userAuth?.id, "followInfo"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user", id, "followInfo"],
      });
    },
  });

  // 3. FIXED BUG: Added return statement
  if (isLoading) {
    return <Skeleton className="h-10 w-24" />; // Adjusted size
  }

  if (isError) {
    return <p>Error</p>;
  }

  return (
    <div className="flex flex-row items-center justify-between">
      {/* 4. FIXED TYPO: isFollowed -> followed */}
      {!followed ? (
        <Button
          className=" rounded-full md:text-xl p-3 text-xs md:p-6 "
          // 5. FIXED TYPO: personId -> id
          onClick={() => mutate({ id: id, type: "follow" })}
          disabled={isPending}
        >
          {isPending ? "Loading..." : "Follow"}
        </Button>
      ) : (
        <Button
          className="bg-[#E0DFDB] rounded-full md:text-xl p-3 text-xs md:p-6 "
          variant="outline"
          // 5. FIXED TYPO: personId -> id
          onClick={() => mutate({ id: id, type: "unfollow" })}
          disabled={isPending}
        >
          {isPending ? "Loading..." : "Following"}
        </Button>
      )}
    </div>
  );
};

export default FollowButton;
