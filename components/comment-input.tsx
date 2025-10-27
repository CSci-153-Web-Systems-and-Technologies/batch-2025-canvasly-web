"use client";

import React, { useState, useEffect } from "react";
import CurrentUserAvatarProfile from "./current-user-avatar-profile";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/client";
import { addComment } from "@/actions/post";
import toast from "react-hot-toast";

const CommentInput = ({ setExpanded, postId, queryId }) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const [value, setValue] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [image_url, setImageUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  // 🔹 Fetch authenticated user
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUserId(data.user.id);
    };
    fetchUser();
  }, []);

  // 🔹 Fetch user profile info
  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("image_url, username")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else if (data) {
        setImageUrl(data.image_url);
        setUsername(data.username);
      }
    };
    fetchProfile();
  }, [userId]);

  const { isPending, mutate } = useMutation({
    mutationFn: (variables: { comment: string; postId: number }) =>
      addComment(variables),

    onMutate: async () => {
      setExpanded(true);

      // Cancel outgoing refetches for this query
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
                    comments: [
                      ...(post.comments || []),
                      {
                        id: Date.now(), // temp id to force re-render
                        comment: value, // must be "comment", not "comments"
                        createdAt: new Date().toISOString(),
                        authorId: userId,
                        author: {
                          image_url,
                          username,
                        },
                      },
                    ],
                  }
                : post
            ),
          })),
        };
      });

      return { previousPosts };
    },

    onError: (err, variables, context) => {
      toast.error("Failed to add comment");
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts", queryId], context.previousPosts);
      }
    },

    onSuccess: (response) => {
      // Merge the actual new comment returned from DB into cache
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
                    comments: [...(post.comments || []), response.data],
                  }
                : post
            ),
          })),
        };
      });

      setValue("");
    },

    onSettled: () => {
      // Refetch to sync final data (optional)
      queryClient.invalidateQueries(["posts", queryId]);
    },
  });

  const handleSendComment = () => {
    if (!value.trim()) return;
    mutate({ comment: value, postId: Number(postId) });
  };

  return (
    <div className="flex items-center gap-4 w-full">
      <CurrentUserAvatarProfile classNameAvatar="" classNameUseRound="" />

      <Input
        placeholder="Write a comment..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isPending}
      />

      <Button onClick={handleSendComment} disabled={isPending || !value.trim()}>
        Send
      </Button>
    </div>
  );
};

export default CommentInput;
