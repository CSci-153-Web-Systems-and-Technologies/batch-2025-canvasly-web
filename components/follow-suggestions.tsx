"use client";

import { createClient } from "@/lib/client";
import React, { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { getFollowSuggestions } from "@/actions/user";
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
      setUserAuth(user); // Set the user for the UI
    };

    fetchAllData();
  }, [supabase]); // The dependency array only needs `supabase`

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", "followSuggestions"],
    queryFn: () => getFollowSuggestions({ userAuth }),
    enabled: !!userAuth,
    staleTime: 1000 * 60 * 20,
  });

  if (!userAuth) {
    return <></>;
  }

  return (
    <div className="p-4 relative w-full h-full rounded-lg bg-white flex flex-col gap-7">
      <div className="flex flex-col gap-2 w-full h-full">
        <h1 className="text-2xl">Follow Suggestions</h1>
      </div>

      <div className="flex flex-col gap-4 w-full">
        {
          // 1. Handle loading state
          userAuth && isLoading ? (
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
          ) : // 2. Handle error state
          userAuth && isError ? (
            <p>Error loading suggestions.</p>
          ) : // 3. Handle success with data
          userAuth && data?.length > 0 ? (
            data?.map((user) => (
              <UserBox
                currentUser={userAuth}
                key={user?.id}
                loggedInUserData={userAuth}
                data={{ follower: user }}
                type="follower"
              /> // Pass user data as a prop
            ))
          ) : (
            userAuth && (
              // 4. Handle success with no data
              <p>No suggestions</p>
            )
          )
        }
      </div>
    </div>
  );
};

export default FollowSuggestions;
