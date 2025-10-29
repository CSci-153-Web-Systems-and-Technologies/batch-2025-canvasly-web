"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { getMyFeedPostsFollowing } from "@/actions/post";
import { Spinner } from "@/components/ui/spinner";
import { useInView } from "react-intersection-observer";
import PostContainer from "./post-container";
import { Separator } from "./ui/separator";

const PostsFollowing = ({ id = "all" }) => {
  const { ref, inView } = useInView();

  const checkLastViewRef = (index, page) => {
    if (index === page?.data?.length - 1) {
      return true;
    } else {
      return false;
    }
  };

  const {
    data,
    isLoading,
    isError,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", id],
    queryFn: ({ pageParam = "" }) => getMyFeedPostsFollowing(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage?.metaData?.lastCursor;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

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
          page?.data?.map((post, index) =>
            checkLastViewRef(index, page) ? (
              <div
                key={post?.id}
                ref={ref}
                className="w-full  p-10 flex items-center flex-col justify-center"
              >
                <PostContainer data={post} queryId={id} />
                <Separator className="mt-10" />
              </div>
            ) : (
              <div
                key={post?.id}
                className="w-full pt-10 flex items-center flex-col justify-center"
              >
                <PostContainer data={post} />
                <Separator className="mt-10" />
              </div>
            )
          )
        )}

        {(isLoading || isFetching || isFetchingNextPage) && (
          <div className="w-full items-center justify-center flex flex-row gap-3">
            <Spinner />
            <p>Loading...</p>
          </div>
        )}
      </div>
    );
  }
};

export default PostsFollowing;
