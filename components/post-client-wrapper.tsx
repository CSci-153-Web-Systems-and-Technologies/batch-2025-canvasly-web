"use client";

import SinglePostContainer from "@/components/single-post-container";
import { useQuery } from "@tanstack/react-query";
import { getPostById } from "@/actions/post";
import type { User } from "@supabase/supabase-js";
import { Skeleton } from "./ui/skeleton";
import { Post } from "@prisma/client";

interface PostClientWrapperProps {
  post: Post; // server-fetched initial data
  authUser: User | null;
  queryId?: string; // optional, for optimistic updates
}

const PostClientWrapper = ({
  post,
  authUser,
  queryId,
}: PostClientWrapperProps) => {
  const postId = post?.id;

  const { data } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostById(postId).then((res) => res.data),
    initialData: post,
    enabled: !!postId,
    staleTime: 1000 * 60,
  });

  if (!data)
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

  return (
    <SinglePostContainer data={data} authUser={authUser} queryId={queryId} />
  );
};

export default PostClientWrapper;
