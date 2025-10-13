"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { getMyFeedPosts } from "@/actions/post";
import { Spinner } from "@/components/ui/spinner";

const Posts = () => {
  const { data, isLoading, isError, isSuccess } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = "" }) => getMyFeedPosts(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage?.metaData?.lastCursor;
    },
  });
  console.log(data);

  if (isError) {
    return <p>Something went wrong! POSTS.TSX</p>;
  }

  if (isLoading) {
    return (
      <div className="w-full items-center justify-center flex flex-row gap-3">
        <Spinner />
        <p>Loading...</p>
      </div>
    );
  }
  if (isSuccess) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-2">
        {data?.pages?.map((page) =>
          page?.data?.map((post, index) => (
            <div
              key={index}
              className="w-full bg-blue-500 p-10 flex lg:min-h-[620px] items-center flex-col justify-center"
            >
              <span>post</span>
            </div>
          ))
        )}
      </div>
    );
  }
};

export default Posts;
