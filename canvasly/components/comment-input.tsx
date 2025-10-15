"use client";

import React, { useState, useEffect } from "react";
import CurrentUserAvatarProfile from "./current-user-avatar-profile";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/client";
import { addComment } from "@/actions/post";
import toast from "react-hot-toast";
//import { User } from "@supabase/supabase-js";

const CommentInput = ({ setExpanded, postId, queryId }) => {
  const supabase = createClient();
  const [value, setValue] = useState("");
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [image_url, set_image_url] = useState<string | null>(null);
  const [username, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("COMMENT-INPUT.TSX Error fetching user:", error);
      } else {
        setUserId(data?.user?.id);
      }
    };

    fetchUser();

    const fetchImageURL = async () => {
      if (userId) {
        const { data, error } = await supabase
          .from("users")
          .select("image_url,username")
          .eq("id", userId)
          .single();

        if (error) {
          console.error(
            "COMMENT-INPUT.TSX Error fetching image_url from users:",
            error
          );
        } else {
          set_image_url(data?.image_url);
          setUserName(data?.username);
        }
      }
    };

    fetchImageURL();
  }, [userId, image_url, username]);

  const { isPending, mutate } = useMutation({
    mutationFn: (variables: { comment: string; postId: number }) =>
      addComment(variables), // 2. Call addComment with correct order

    onMutate: async () => {
      setExpanded(true);

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
                    comments: [
                      ...post.comments,
                      {
                        comments: value,
                        authorId: userId,
                        author: {
                          image_url: image_url,
                          username: username,
                        },
                      },
                    ],
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
    onError: (err, variables, context) => {
      toast.error("Failed to add comment");
      queryClient.setQueryData(["posts"], context?.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // Use queryKey for newer versions
      setValue("");
    },
  });

  const handleSendComment = () => {
    const commentData = {
      comment: value,
      postId: Number(postId), // Ensure postId is a number
    };
    // You MUST pass the data object here
    mutate(commentData);
  };

  return (
    <div className="flex items-center gap-4 w-full">
      <CurrentUserAvatarProfile />

      <Input
        placeholder="comment"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      ></Input>
      <Button
        onClick={handleSendComment}
        disabled={isPending || !value || value === ""}
      >
        Send
      </Button>
    </div>
  );
};

export default CommentInput;
