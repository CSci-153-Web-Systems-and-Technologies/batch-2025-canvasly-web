//import PopularTrends from "@/components/popular-trends";
import PostsFollowing from "@/components/posts-following";
import React from "react";

const FollowingView = () => {
  return (
    <div className="w-full flex flex-col items-start justify-center bg-background rounded-xl">
      <PostsFollowing />
    </div>
  );
};

export default FollowingView;
