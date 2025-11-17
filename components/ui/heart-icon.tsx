"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updatePostLike } from "@/actions/post";
import { updateQueryCacheLikes } from "@/utils";

const HeartIcon = ({ postId, likes = [], queryId }) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const [user, setUser] = useState<User | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  // Fetch Supabase user once
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    };
    fetchUser();
  }, [supabase]);

  // Keep isLiked in sync with props (server)
  useEffect(() => {
    if (user?.id) {
      setIsLiked(likes?.some((like) => like?.authorId === user.id));
    }
  }, [likes, user]);

  const { mutate } = useMutation({
    mutationFn: updatePostLike,

    onMutate: async (params) => {
      await queryClient.cancelQueries(["posts", queryId]);

      const previousPosts = queryClient.getQueryData(["posts", queryId]);

      queryClient.setQueryData(["posts", queryId], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((post) =>
              post.id === params.postId
                ? {
                    ...post,
                    likes: updateQueryCacheLikes(
                      post.likes,
                      params.postId,
                      params.userId,
                      params.actionType
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
      console.error("Error updating post like:", err);
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts", queryId], context.previousPosts);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries(["posts", queryId]);
    },
  });

  const handleClick = () => {
    if (!user) return;

    // Optimistically toggle heart color
    setIsLiked((prev) => !prev);

    mutate({
      postId,
      userId: user.id,
      actionType: isLiked ? "unlike" : "like",
    });
  };

  return (
    <div className="flex flex-row justify-center items-center space-x-2">
      <button
        onClick={handleClick}
        className="flex items-center justify-center rounded-full h-10 w-10 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500 hover:bg-gray-100"
        aria-label="Like post"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill={isLiked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-6 w-6 ${isLiked ? "text-red-500" : "text-gray-600"}`}
        >
          <path d="M19.5 12.572l-7.5 7.428-7.5-7.428a5 5 0 1 1 7.5-6.566 5 5 0 1 1 7.5 6.566z" />
        </svg>
      </button>

      <span className="text-sm text-gray-700">
        {likes.length > 0 &&
          `${likes.length} ${likes.length === 1 ? "Like" : "Likes"}`}
      </span>
    </div>
  );
};

export default HeartIcon;
