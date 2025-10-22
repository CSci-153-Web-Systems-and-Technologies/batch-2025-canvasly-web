"use client";

import { createClient } from "@/lib/client";
import React, { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
// 1. Import your action for fetching follow info
import { getFollowSuggestions, getFollowInfo } from "@/actions/user";
import { Skeleton } from "./ui/skeleton";
import UserBox from "./user-box";

const FollowSuggestions = () => {
  const supabase = createClient();
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
    queryFn: () => getFollowSuggestions({ userAuth }),
    enabled: !!userAuth,
    staleTime: 1000 * 60 * 20,
  });

  if (!userAuth) {
    return <></>;
  }

  return (
    userAuth && (
      <div className="p-4 relative w-full h-full rounded-lg bg-white flex flex-col gap-7">
        <div className="flex flex-col gap-2 w-full h-full">
          <h1 className="text-2xl">Follow Suggestions</h1>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {isLoading ? (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div className="flex w-full gap-1" key={i}>
                  <div className="flex w-full gap-1" key={i}>
                    <div className="flex w-full items-center space-x-3">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="space-y-1 w-full">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : isError ? (
            <p>Error loading suggestions.</p>
          ) : suggestions?.length > 0 ? (
            suggestions.map((user) => (
              <UserBox
                currentUser={userAuth}
                key={user?.id}
                // 4. FIX B: Pass the real followInfo data here
                loggedInUserData={followInfo}
                data={{ follower: user }} // This data structure is correct for UserBox
                type="follower"
              />
            ))
          ) : (
            <p>No suggestions</p>
          )}
        </div>
      </div>
    )
  );
};

export default FollowSuggestions;
