"use client";

import React, { useEffect, useState } from "react";
import CurrentUserAvatarProfile from "./current-user-avatar-profile";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/client";
import { addComment, updateComment } from "@/actions/post";
import toast from "react-hot-toast";

const CommentInput = ({
  setExpanded,
  postId,
  queryId,
  editComment,
  setEditComment,
}) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const [value, setValue] = useState("");

  // Populate input with edit comment text when editing
  useEffect(() => {
    if (editComment) {
      setValue(editComment.text);
    }
  }, [editComment]);

  const { mutate: addMutate, isPending: isAdding } = useMutation({
    mutationFn: (variables: { comment: string; postId: number }) =>
      addComment(variables),
    onSuccess: (response) => {
      queryClient.invalidateQueries(["posts", queryId]);
      setValue("");
    },
  });

  const { mutate: editMutate, isPending: isEditing } = useMutation({
    mutationFn: ({ id, text }: { id: number; text: string }) =>
      updateComment(id, text),
    onSuccess: (response) => {
      queryClient.invalidateQueries(["posts", queryId]);
      setValue("");
      setEditComment(null);
    },
  });

  const handleSendComment = () => {
    if (!value.trim()) return;

    if (editComment) {
      editMutate({ id: editComment.id, text: value });
    } else {
      addMutate({ comment: value, postId: Number(postId) });
    }
  };

  return (
    <div className="flex items-center gap-4 w-full mt-2">
      <CurrentUserAvatarProfile classNameAvatar="" classNameUseRound="" />
      <Input
        placeholder="Write a comment..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isAdding || isEditing}
      />
      <Button
        onClick={handleSendComment}
        disabled={!value.trim() || isAdding || isEditing}
      >
        {editComment ? "Update" : "Send"}
      </Button>
    </div>
  );
};

export default CommentInput;
