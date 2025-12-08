"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { getMyFeedPosts } from "@/actions/post";
import { Spinner } from "@/components/ui/spinner";
import { useInView } from "react-intersection-observer";
import PostContainer from "./post-container";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

const Posts = ({ id = "all" }) => {
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
    queryFn: ({ pageParam = "" }) => getMyFeedPosts(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage?.metaData?.lastCursor;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  if (isError) {
    return (
      <div className="w-full p-10 flex items-center flex-col justify-center">
        <div className="w-full flex items-center justify-center flex-row gap-3">
          <Spinner />
          <p>Something went wrong! Please Refresh page</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full  p-10 flex items-center flex-col justify-center">
        <div className="w-[335px] sm:w-[490px] md:w-[420px] lg:w-[620px] xl:w-[700px] h-64 md:h-96 justify-between flex flex-col  gap-2">
          <div className="flex w-full items-center space-x-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-1 w-full">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>

          <div className="flex flex-row justify-between">
            <Skeleton className="h-4 w-20 sm:w-24 md:w-24 lg:w-32" />
            <Skeleton className=" h-4 w-20 sm:w-24 md:w-24 lg:w-32" />
            <Skeleton className="h-4 w-20 sm:w-24 md:w-24 lg:w-32" />
          </div>
        </div>
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
          <div className="w-full  p-10 flex items-center flex-col justify-center">
            <div className="w-[335px] sm:w-[490px] md:w-[420px] lg:w-[620px] xl:w-[700px] h-64 md:h-96 justify-between flex flex-col  gap-2">
              <div className="flex w-full items-center space-x-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-1 w-full">
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>

              <div className="flex flex-row justify-between">
                <Skeleton className="h-4 w-20 sm:w-24 md:w-24 lg:w-32" />
                <Skeleton className=" h-4 w-20 sm:w-24 md:w-24 lg:w-32" />
                <Skeleton className="h-4 w-20 sm:w-24 md:w-24 lg:w-32" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default Posts;
