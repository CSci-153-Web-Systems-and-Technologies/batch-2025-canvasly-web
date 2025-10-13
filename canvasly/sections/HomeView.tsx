import Posts from "@/components/posts";
import React from "react";

const HomeView = () => {
  return (
    <div className="w-full flex justify-between  gap-4">
      <div className=" w-full items-start justify-center flex bg-background max-w-5xl  rounded-xl">
        <Posts />
      </div>

      <div className=" items-start justify-center hidden md:flex max-w-sm">
        <span>Follow Suggestionss</span>
      </div>
    </div>
  );
};

export default HomeView;
