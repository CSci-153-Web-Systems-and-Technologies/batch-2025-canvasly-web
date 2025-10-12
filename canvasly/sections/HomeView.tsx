import React from "react";

const HomeView = () => {
  return (
    <div className="w-full flex justify-between  gap-4">
      <div className="bg-red-200 w-full items-start justify-center flex ">
        <span>POST generator</span>
        <span>Posts</span>
      </div>

      <div className=" items-start justify-center hidden md:flex max-w-sm">
        <span>Follow Suggestionss</span>
      </div>
    </div>
  );
};

export default HomeView;
