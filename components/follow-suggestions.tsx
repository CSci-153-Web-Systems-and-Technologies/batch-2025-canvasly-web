"use client";

import { createClient } from "@/lib/client";
import React, { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { getFollowSuggestions, getFollowInfo } from "@/actions/user";
import { Skeleton } from "./ui/skeleton";
import UserBox from "./user-box";
import { Spinner } from "./ui/spinner";

const FollowSuggestions = () => {
  const supabase = createClient();
  const [userAuth, setUserAuth] = useState<User | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData?.session) return;
      setUserAuth(sessionData.session.user);
    };

    fetchAllData();
  }, []);

  const { data: followInfo } = useQuery({
    queryKey: ["user", userAuth?.id, "followInfo"],
    queryFn: () => getFollowInfo(userAuth.id),
    enabled: !!userAuth,
  });

  const {
    data: suggestions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", "followSuggestions", userAuth?.id],
    queryFn: () => getFollowSuggestions({ userAuth }),
    enabled: !!userAuth,
    staleTime: 1000 * 60 * 20,
  });

  if (!userAuth) return null;

  return (
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
                <div className="flex w-full items-center space-x-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="space-y-1 w-full">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>
              </div>
            ))
        ) : isError ? (
          <div className="flex flex-row w-full gap-3">
            <Spinner />
            <p>Error loading suggestions.</p>
          </div>
        ) : suggestions?.length > 0 ? (
          // Limit to 5 suggestions
          suggestions
            .slice(0, 5)
            .map((user) => (
              <UserBox
                currentUser={userAuth}
                key={user?.id}
                loggedInUserData={followInfo}
                data={{ follower: user }}
                type="follower"
              />
            ))
        ) : (
          <p>No suggestions</p>
        )}
      </div>
    </div>
  );
};

export default FollowSuggestions;
