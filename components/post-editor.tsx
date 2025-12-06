"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Plus, PhilippinePeso, X } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import Image from "next/image";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostInput } from "@/lib/constants";

interface PostEditorProps {
  post?: {
    id: number;
    image_post_url: string;
    cld_id?: string | null;
    title: string;
    art_type: string;
    post_description: string | null;
    price: number | null;
  };
}

const PostEditor = ({ post }: PostEditorProps) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [post_description, set_post_description] = useState(
    post?.post_description || ""
  );
  const [title, set_title] = useState(post?.title || "");
  const [art_type, set_art_type] = useState(post?.art_type || "");
  const [price, setPrice] = useState<number | null>(post?.price ?? null);

  const [selectedFile, setSelectedFile] = useState(post?.image_post_url || "");
  const [fileType, setFileType] = useState<string | null>(
    post ? "image" : null
  );

  const imgInputRef = React.useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  const { mutate: execute, isPending } = useMutation({
    mutationFn: async (
      data: PostInput & { id?: number; prevImageId?: string | null }
    ) => {
      const res = await fetch("/api/posts", {
        method: post ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          id: post?.id,
          prevImageId: post?.cld_id || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to save post");
      return res.json();
    },
    onSuccess: () => {
      toast.success(post ? "Post updated!" : "Post created!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => toast.error("Something went wrong while saving the post."),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4_000_000) {
      toast.error("File size exceeds 4 MB");
      return;
    }

    if (file.type.startsWith("image/")) setFileType("image");

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result && typeof reader.result === "string")
        setSelectedFile(reader.result);
    };
  };

  const handleClearPreview = () => {
    setSelectedFile("");
    setFileType(null);
  };

  const submitPost = () => {
    if (!selectedFile) return toast.error("Image is required");
    if (!title) return toast.error("Title is required");
    if (!art_type) return toast.error("Art type is required");
    if (price !== null && price < 0)
      return toast.error("Price cannot be negative");

    execute({
      title,
      image_post_url: selectedFile,
      art_type,
      post_description,
      price,
      prevImageId: post?.cld_id, // must be Cloudinary public ID
    });
  };

  return (
    <div className="w-full flex flex-col bg-[#f5f5f5] items-center justify-center px-4 py-8 sm:p-16 gap-8">
      <div className="flex flex-col items-center justify-center w-full gap-1 text-lg text-center">
        {isClient && selectedFile && fileType === "image" && (
          <div className="relative flex items-center h-[250px] w-[250px] sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[500px] mb-8">
            <Image
              src={selectedFile}
              alt="post image"
              fill
              className="object-cover rounded-3xl"
            />
            <Button
              onClick={handleClearPreview}
              className="rounded-full absolute top-3 right-3"
              variant="outline"
              size="icon"
            >
              <X color="#666666" />
            </Button>
          </div>
        )}
        <Button
          className="rounded-full md:text-xl p-6 mb-2"
          onClick={() => imgInputRef.current?.click()}
        >
          <Plus /> Replace image
        </Button>
        <p>JPEG / PNG</p>
        <p>You can upload up to 4 MB only</p>
      </div>

      <div className="w-full max-w-3xl mx-auto gap-4 flex flex-col items-center justify-center">
        <div className="w-full gap-2 flex flex-col">
          <Input
            className="bg-white"
            placeholder="Title"
            value={title}
            onChange={(e) => set_title(e.target.value)}
          />
          <Textarea
            className="bg-white"
            placeholder="Caption"
            value={post_description}
            onChange={(e) => set_post_description(e.target.value)}
          />
        </div>
        <Input
          className="bg-white"
          placeholder="Type (e.g., Traditional Art)"
          value={art_type}
          onChange={(e) => set_art_type(e.target.value)}
        />
        <div className="w-full flex items-center justify-center relative">
          <Input
            className="bg-white relative p-6 pl-9"
            placeholder="Price in Peso"
            type="number"
            value={price ?? ""}
            onChange={(e) =>
              setPrice(e.target.value === "" ? null : Number(e.target.value))
            }
          />
          <PhilippinePeso className="absolute left-2" color="#666666" />
        </div>
        <Separator className="bg-[#9a9a9a]" />
        <p>{`Please only upload work that you've created or have permission to post.`}</p>
        <Button
          className="rounded-full md:text-xl px-20 py-6 mt-12"
          onClick={submitPost}
          disabled={isPending}
        >
          {isPending
            ? post
              ? "Updating..."
              : "Posting..."
            : post
            ? "Update Post"
            : "Post"}
        </Button>
        <Button
          className="rounded-full md:text-xl px-24 md:px-28 py-6 mt-5"
          variant="destructive"
          disabled={isPending}
          onClick={() => setShowDeleteConfirm(true)}
        >
          Delete
        </Button>

        {showDeleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Dark overlay */}
            <div
              className="absolute inset-0 bg-black opacity-50"
              onClick={() => setShowDeleteConfirm(false)}
            ></div>

            {/* Modal content */}
            <div className="relative bg-white p-6 rounded-xl shadow-xl flex flex-col items-center gap-4 z-10 max-w-sm w-full">
              <p className="text-lg font-semibold">Delete this work?</p>
              <div className="flex flex-col w-full gap-4">
                <Button
                  className="px-6 py-2 w-full"
                  variant="destructive"
                  onClick={async () => {
                    if (!post?.id) return;

                    try {
                      const res = await fetch(`/api/posts?id=${post.id}`, {
                        method: "DELETE",
                      });

                      if (!res.ok) throw new Error("Failed to delete post");

                      // Close the modal immediately
                      setShowDeleteConfirm(false);

                      toast.success("Post deleted successfully!");
                      queryClient.invalidateQueries({ queryKey: ["posts"] });

                      // Redirect after deletion
                      window.location.href = "/";
                    } catch (err) {
                      console.error(err);
                      toast.error("Failed to delete post.");
                    }
                  }}
                >
                  Confirm
                </Button>

                <Button
                  className="px-6 py-2 w-full"
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={imgInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default PostEditor;
