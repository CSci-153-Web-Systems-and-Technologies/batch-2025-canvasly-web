import { getAllFollowersAndFollowingsInfo } from "@/actions/user";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const FollowInfo = ({ userId }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user", userId, "followInfo"],
    queryFn: () => getAllFollowersAndFollowingsInfo(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 20,
  });

  if (isLoading) {
    return <p>LOADING FETCHING FOLLOWERS AND FOLLOWING</p>;
  }

  if (isError) {
    return <p>ERROR</p>;
  }

  return userId ? (
    <div className="flex flex-col sm:flex-row text-xs md:text-xl gap-0 sm:gap-4">
      <div className="flex flex-row gap-1">
        <span className="font-bold">{data?.followers?.length}</span>
        <span className=" flex text-[#818181]">Followers</span>
      </div>
      <div className="flex flex-row gap-1">
        <span className="font-bold">{data?.following?.length}</span>
        <span className=" flex text-[#818181]">Following</span>
      </div>
    </div>
  ) : (
    <p>LOADING USER ID</p>
  );
};

export default FollowInfo;
