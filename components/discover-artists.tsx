"use client";

import { createClient } from "@/lib/client";
import React, { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getArtists, getFollowInfo } from "@/actions/user";
import { Skeleton } from "./ui/skeleton";
import ArtistBox from "./artist-box";

const DiscoverArtists = () => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const [userAuth, setUserAuth] = useState<User | null>(null);

  //
  // 1️⃣ Fetch user on first mount
  //
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("Error fetching user:", error);
        return;
      }

      setUserAuth(user);
    };

    fetchUser();
  }, [supabase]);

  //
  // 2️⃣ Force re-fetch suggestions + followInfo once userAuth loads
  //
  useEffect(() => {
    if (!userAuth) return;

    queryClient.invalidateQueries({
      queryKey: ["user", "followSuggestions", userAuth.id],
    });

    queryClient.invalidateQueries({
      queryKey: ["user", userAuth.id, "followInfo"],
    });
  }, [userAuth, queryClient]);

  //
  // 3️⃣ Fetch user follow info
  //
  const { data: followInfo = { following: [], followers: [] } } = useQuery({
    queryKey: ["user", userAuth?.id, "followInfo"],
    queryFn: () => getFollowInfo(userAuth!.id),
    enabled: !!userAuth,
  });

  //
  // 4️⃣ Fetch artist suggestions
  //
  const {
    data: suggestions = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", "followSuggestions", userAuth?.id],
    queryFn: () => getArtists({ userAuth }),
    enabled: !!userAuth,
    staleTime: 1000 * 60 * 20,
  });

  //
  // 5️⃣ Skeleton loader (for loading state or no userAuth yet)
  //
  const SkeletonGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-8 w-full ">
      {Array(2)
        .fill(0)
        .map((_, i) => (
          <div className="flex flex-col gap-4" key={i}>
            <div className="relative w-full h-[280px] sm:h-[310px] lg:h-[360px] xl:h-[280px] rounded-lg overflow-hidden bg-[#dedede]">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="flex flex-row items-center justify-between w-full">
              <div className="flex flex-row items-center gap-3 w-full">
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-4 w-3/5" />
              </div>

              <Skeleton className="block h-8 w-20" />
            </div>
          </div>
        ))}
    </div>
  );

  //
  // 6️⃣ MAIN RENDER
  //
  return (
    <div className="p-4 lg:p-10 relative w-full h-full rounded-lg bg-white flex flex-col gap-7 ">
      <div className="flex flex-col gap-2 w-full h-full">
        <h2 className="text-3xl lg:text-5xl mb-2 md:mb-4">Artists</h2>
      </div>

      {!userAuth || isLoading ? (
        <SkeletonGrid />
      ) : isError ? (
        <p>discover-artists.tsx Error loading suggestions.</p>
      ) : suggestions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-8 w-full ">
          {suggestions
            .filter((u) => u.posts?.length > 0)
            .map((user) => (
              <ArtistBox
                currentUser={userAuth}
                key={user.id}
                loggedInUserData={followInfo}
                data={{ follower: user }}
                type="follower"
              />
            ))}
        </div>
      ) : (
        <p>You Followed All Artists</p>
      )}
    </div>
  );
};

export default DiscoverArtists;
