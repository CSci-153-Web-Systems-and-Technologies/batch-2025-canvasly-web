"use client";

import React from "react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updatePostLike } from "@/actions/post";
import { updateQueryCacheLikes } from "@/utils";

const HeartIcon = ({ postId, likes, queryId }) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const [userId, setUserId] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const actionType = isLiked ? "unlike" : "like";

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("HEART-ICON.TSX Error fetching user:", error);
      } else {
        setUserId(data.user.id);
        setUser(data.user);
      }
    };

    fetchUser();
  }, [supabase.auth]);

  useEffect(() => {
    setIsLiked(likes?.some((like) => like?.authorId == userId));
  }, [user, likes]);

  const { mutate } = useMutation({
    mutationFn: (params) => updatePostLike(params),
    onMutate: async () => {
      await queryClient.cancelQueries(["posts", queryId]);

      const previousPosts = queryClient.getQueryData(["posts", queryId]);

      queryClient.setQueriesData(["posts", queryId], (old) => {
        return {
          ...old,
          pages: old.pages.map((page) => {
            return {
              ...page,
              data: page.data.map((post) => {
                if (post.id === postId) {
                  return {
                    ...post,
                    likes: updateQueryCacheLikes(
                      post.likes,
                      postId,
                      user?.id,
                      actionType
                    ),
                  };
                } else {
                  return post;
                }
              }),
            };
          }),
        };
      });

      return { previousPosts };
    },

    onError: (err, varaibles, context) => {
      console.log("this is error", err);
      queryClient.setQueriesData(["posts", queryId], context.previousPosts);
    },

    onSettled: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  return (
    <div className="flex flex-row justify-center items-center">
      <button
        onClick={() => mutate({ postId, actionType })}
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
      <span>
        {likes.length > 0 &&
          `${likes.length} ${likes.length === 1 ? "Like" : "Likes"}`}
      </span>
    </div>
  );
};

export default HeartIcon;
