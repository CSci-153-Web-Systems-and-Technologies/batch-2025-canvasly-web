"use client";

import { createClient } from "@/lib/client";
import React, { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
// 1. Import your action for fetching follow info
import { getArtists, getFollowInfo } from "@/actions/user";
import { Skeleton } from "./ui/skeleton";
//import UserBox from "./user-box";
import ArtistBox from "./artist-box";

const DiscoverArtists = () => {
  const supabase = createClient();
  const [userAuth, setUserAuth] = useState<User | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData?.session) {
        console.warn("No session yet");
        return;
      }

      setUserAuth(sessionData.session.user);
    };

    fetchAllData();
  }, []);

  // 2. ADD THIS QUERY: Fetch the real follow info
  // This is the data UserBox needs for its optimistic update.
  const { data: followInfo } = useQuery({
    queryKey: ["user", userAuth?.id, "followInfo"],
    queryFn: () => getFollowInfo(userAuth.id), // Assumes getFollowInfo takes a user ID
    enabled: !!userAuth, // Only run when we have the user
  });

  // 3. FIX THIS QUERY
  const {
    data: suggestions, // Renamed to suggestions for clarity
    isLoading,
    isError,
  } = useQuery({
    // FIX A: Key must match UserBox. Use userAuth.id so it refetches on user change.
    queryKey: ["user", "followSuggestions", userAuth?.id],
    queryFn: () => getArtists({ userAuth }),
    enabled: !!userAuth,
    staleTime: 1000 * 60 * 20,
  });

  if (!userAuth) {
    return <></>;
  }

  return (
    userAuth && (
      <div className="p-4 lg:p-10 relative w-full h-full rounded-lg bg-white flex flex-col gap-7 ">
        <div className="flex flex-col gap-2 w-full h-full">
          <h2 className="text-3xl lg:text-5xl mb-2 md:mb-4">Artists</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-8 w-full ">
          {isLoading ? (
            Array(2)
              .fill(0)
              .map((_, i) => (
                <div className="flex flex-col gap-4" key={i}>
                  <div className="relative w-full h-[160px] sm:h-[140px] md:h-[160px] lg:h-[210px] xl:h-[280px] rounded-lg overflow-hidden bg-[#dedede]">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <div className="flex flex-row items-center justify-between w-full">
                    <div className="flex flex-row items-center gap-3 w-full">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <Skeleton className="h-4 w-2/5" />
                    </div>

                    <Skeleton className=" hidden md:block h-8 w-20" />
                  </div>
                </div>
              ))
          ) : isError ? (
            <p>discover-artists.tsx Error loading suggestions.</p>
          ) : suggestions?.length > 0 ? (
            suggestions
              .filter((u) => u.posts?.length > 0) // force only artists with posts
              .map((user) => (
                <ArtistBox
                  currentUser={userAuth}
                  key={user?.id}
                  loggedInUserData={followInfo}
                  data={{ follower: user }}
                  type="follower"
                />
              ))
          ) : (
            <p>You Followed All Artists</p>
          )}
        </div>
      </div>
    )
  );
};

export default DiscoverArtists;
