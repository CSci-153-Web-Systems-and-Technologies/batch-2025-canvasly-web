"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import CommentInput from "./comment-input";
import Comment from "./comment";
import { ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Skeleton } from "./ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "@/actions/post";

const CommentSection = ({ comments, postId, queryId }) => {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [parent] = useAutoAnimate();

  const [editComment, setEditComment] = useState<{
    id: number;
    text: string;
  } | null>(null);

  const queryClient = useQueryClient();

  // Fetch current user
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    checkUser();
  }, []);

  // React Query mutation for deleting comments
  const { mutate: handleDeleteComment } = useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onMutate: async (commentId) => {
      // Optimistically update UI
      await queryClient.cancelQueries(["posts", queryId]);
      const previousPosts = queryClient.getQueryData(["posts", queryId]);

      queryClient.setQueryData(["posts", queryId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((post: any) =>
              post.id === postId
                ? {
                    ...post,
                    comments: post.comments.filter(
                      (c: any) => c.id !== commentId
                    ),
                  }
                : post
            ),
          })),
        };
      });

      return { previousPosts };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts", queryId], context.previousPosts);
      }
    },
    onSettled: () => {
      // Refetch to ensure sync
      queryClient.invalidateQueries(["posts", queryId]);
    },
  });

  if (loading) {
    return (
      <div className="flex flex-row justify-between w-full">
        <Skeleton className="h-4 w-20 sm:w-24 md:w-24 lg:w-32" />
        <Skeleton className="h-4 w-20 sm:w-24 md:w-24 lg:w-32" />
        <Skeleton className="h-4 w-20 sm:w-24 md:w-24 lg:w-32" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-2">
      {comments?.length > 1 && (
        <div className="flex flex-col gap-4">
          <Button
            className="p-6"
            variant="ghost"
            onClick={() => setExpanded((prev) => !prev)}
          >
            <div className="flex flex-row justify-center items-center gap-2">
              <ChevronDown color="#303030" />
              <span>Show more comments</span>
              <div className="py-0.5 px-3 flex flex-row items-center justify-center rounded-2xl bg-[#8c8c8c] text-white">
                {comments?.length}
              </div>
            </div>
          </Button>
        </div>
      )}

      {comments?.length > 0 && (
        <div
          ref={parent}
          id="comments-container"
          className="flex flex-col gap-2"
        >
          {!expanded ? (
            <Comment
              data={comments[comments.length - 1]}
              onEdit={(id, text) => setEditComment({ id, text })}
              onDelete={(id) => handleDeleteComment(id)}
            />
          ) : (
            <ScrollArea className="max-h-72 w-full">
              <div className="flex flex-col gap-2 pr-2">
                {comments.map((comment, index) => (
                  <Comment
                    key={index}
                    data={comment}
                    onEdit={(id, text) => setEditComment({ id, text })}
                    onDelete={(id) => handleDeleteComment(id)}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      )}

      {user && (
        <CommentInput
          setExpanded={setExpanded}
          postId={postId}
          queryId={queryId}
          editComment={editComment}
          setEditComment={setEditComment}
        />
      )}
    </div>
  );
};

export default CommentSection;
