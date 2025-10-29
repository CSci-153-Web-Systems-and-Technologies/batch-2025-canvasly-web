"use client";

import { getAllFollowersAndFollowingsInfo } from "@/actions/user";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { createClient } from "@/lib/client";
import { User } from "@supabase/supabase-js";
import UserFollowBox from "./user-follow-box";

const FollowPersonsBody = ({ type, id }) => {
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

  const { data: currentUserData } = useQuery({
    queryKey: ["user", userAuth?.id, "followInfo"],
    queryFn: () => getAllFollowersAndFollowingsInfo(userAuth?.id),
    enabled: !!userAuth?.id,
    staleTime: 1000 * 60 * 20,
  });

  const {
    data: userData,
    isLoading: userDataLoading,
    isError: userDataError,
  } = useQuery({
    queryKey: ["user", id, "followInfo"],
    queryFn: () => getAllFollowersAndFollowingsInfo(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 20,
  });

  if (userDataLoading) {
    return <Skeleton className="w-full h-14" />;
  }

  if (userDataError) {
    return <p>ERROR FOLLOW-PERSONS-BODY.TSX</p>;
  }

  return (
    <div className="w-full h-14">
      <div className="w-full my-2">
        {userData?.[type]?.length === 0 ? (
          <div className="bg-[#f5f5f5] p-5 rounded-lg">
            <p>{`No ${type}`}</p>
          </div>
        ) : (
          <div>
            {userData?.[type]?.map((person) => (
              <UserFollowBox
                key={
                  person?.[type === "followers" ? "followerId" : "followingId"]
                }
                userObjectKey={type === "followers" ? "follower" : "following"}
                data={person}
                loggedInUserFollowInfo={currentUserData}
                // --- THIS IS THE FIX ---
                // Pass the authenticated user's ID directly
                loggedInUserId={userAuth?.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowPersonsBody;
