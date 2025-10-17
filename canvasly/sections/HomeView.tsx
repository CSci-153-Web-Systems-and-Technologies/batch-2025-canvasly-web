//import PopularTrends from "@/components/popular-trends";
import Posts from "@/components/posts";
import React from "react";

const HomeView = () => {
  return (
    <div className="w-full flex flex-col items-start justify-center bg-background rounded-xl">
      <Posts />
    </div>
  );
};

export default HomeView;
