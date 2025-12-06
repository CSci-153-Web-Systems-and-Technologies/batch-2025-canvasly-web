"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { getMyArtwork } from "@/actions/post";
//import { Spinner } from "@/components/ui/spinner";
import { useInView } from "react-intersection-observer";
import ArtworkContainer from "./artwork-container";
import { Skeleton } from "./ui/skeleton";

const ProfileArtworks = ({ id }) => {
  const { ref, inView } = useInView();

  const checkLastViewRef = (index, page) => {
    if (index === page?.data?.length - 1) {
      return true;
    } else {
      return false;
    }
  };

  // ProfileArtworks.tsx

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
    // FIX 1: Change this to a number
    initialPageParam: 0,

    // FIX 2: Pass the number (defaulting to 0) and the userId
    queryFn: ({ pageParam = 0 }) =>
      getMyArtwork({ cursor: pageParam, userId: id }),

    // FIX 3: This will now receive a number (or null/undefined) from your server action
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
      <div className="w-full flex h-full flex-col">
        <div className="w-[160px] sm:w-[140px] md:w-[160px] lg:w-[210px] xl:w-[280px] h-full flex flex-col justify-center gap-3">
          <Skeleton className="relative w-full h-[160px] sm:h-[140px] md:h-[160px] lg:h-[210px] xl:h-[280px] rounded-lg overflow-hidden bg-[#dedede]" />
          <Skeleton className="w-1/2 h-6" />
        </div>
      </div>
    );
  }
  if (isSuccess) {
    return (
      <div className="max-w-7xl w-full grid grid-cols-2 sm:grid-cols-4 ">
        {data?.pages?.map((page) =>
          page?.data?.map((post, index) =>
            checkLastViewRef(index, page) ? (
              <div
                key={post?.id}
                ref={ref}
                className="w-full flex  items-center flex-col justify-center mt-3"
              >
                <ArtworkContainer data={post} queryId={id} />
              </div>
            ) : (
              <div
                key={post?.id}
                className="w-full flex items-center flex-col justify-center mt-3"
              >
                <ArtworkContainer data={post} />
              </div>
            )
          )
        )}

        {(isLoading || isFetching || isFetchingNextPage) && (
          <div className="w-full flex h-full items-center flex-col justify-center">
            <div className="w-[160px] sm:w-[140px] md:w-[160px] lg:w-[210px] xl:w-[280px] h-full flex flex-col justify-center gap-3">
              <Skeleton className="relative w-full h-[160px] sm:h-[140px] md:h-[160px] lg:h-[210px] xl:h-[280px] rounded-lg overflow-hidden bg-[#dedede]" />
              <Skeleton className="w-1/2 h-6" />
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default ProfileArtworks;
