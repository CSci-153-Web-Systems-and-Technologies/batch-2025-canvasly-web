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

const PostGenerator = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const [post_description, set_post_description] = useState("");
  const [title, set_title] = useState("");
  const [art_type, set_art_type] = useState("");
  const [price, setPrice] = useState<number | null>(null);

  const [fileType, setFileType] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState("");

  const imgInputRef = React.useRef<HTMLInputElement | null>(null);

  const queryClient = useQueryClient();

  // mutate in react query
  const { mutate: execute, isPending } = useMutation({
    mutationFn: async (data: PostInput) => {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create post");
      return res.json();
    },
    onSuccess: () => {
      handleSuccess();
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => showError("Something went wrong while posting."),
  });

  const handleSuccess = () => {
    setSelectedFile("");
    setFileType(null);
    set_title("");
    set_post_description("");
    set_art_type("");
    setPrice(null);

    toast.success("Post succesful!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    // limit to 8MB
    if (file && file.size > 8_000_000) {
      alert("File size exceeds 8 MB");
      return;
    }

    if (file && file.type.startsWith("image/")) {
      setFileType(file.type.split("/")[0]);
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      if (reader.result && typeof reader.result === "string") {
        setSelectedFile(reader.result);
      }
    };
  };

  const handleClearPreview = () => {
    setSelectedFile("");
    setFileType(null);
  };

  const showError = (msg: string) => {
    toast.error(msg);
  };

  const submitPost = () => {
    if (!selectedFile) {
      showError("Cant make an empty post");
    } else if (!title || title === "") {
      showError("Add title to your post");
    } else if (!art_type || art_type === "") {
      showError("Add art type to your post");
    }

    execute({
      title: title,
      image_post_url: selectedFile,
      art_type: art_type,
      post_description: post_description,
      price: price,
    });
  };

  return (
    <>
      <div className="w-full flex flex-col bg-[#E0DFDB] items-center justify-center p-4 sm:p-16 gap-8">
        <div className="flex flex-col items-center justify-center w-full gap-1 text-lg text-center">
          {isClient && fileType && selectedFile && (
            <div className="relative flex items-center h-[250px] w-[250px] sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[500px] mb-8">
              {fileType === "image" && (
                <Image
                  src={selectedFile}
                  alt="selected file image"
                  fill
                  className="object-cover rounded-3xl"
                />
              )}
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
            className=" rounded-full md:text-xl p-6 mb-2"
            onClick={() => imgInputRef.current?.click()}
          >
            <Plus />
            Add image
          </Button>
          <p>JPEG / PNG</p>
          <p>You can upload up to 8 MB only</p>
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
              value={price !== null ? price : ""}
              onChange={(e) => {
                const val = e.target.value;
                setPrice(val === "" ? null : Number(val));
              }}
            />
            <PhilippinePeso className="absolute left-2" color="#666666" />
          </div>
          <Separator className="bg-[#9a9a9a]" />
          <div className="bg-white w-full rounded-lg p-4 flex flex-col gap-8">
            <p>
              Posting works corresponding to the following is prohibited. Please
              check before posting your work.
            </p>
            <div className="text-[#777777] w-full flex flex-col gap-4 px-4">
              <p>
                Works created by others, images that third parties have the
                rights to, works that include captures of games or video works,
                or screenshot images.
              </p>
              <p>
                Works that use the above images and do not make everything by
                yourself from the beginning.
              </p>
            </div>
          </div>
          <p>
            {`Please only upload work that you've created or have permission to
            post.`}
          </p>
          <Button
            className="rounded-full md:text-xl px-20 py-6 mt-12"
            onClick={submitPost}
            disabled={isPending} // disable button while uploading
          >
            {isPending ? "Posting..." : "Post"}
          </Button>
        </div>
        <input
          type="file"
          accept="image/*"
          multiple={false}
          className="hidden"
          ref={imgInputRef}
          onChange={handleFileChange}
        />
      </div>
    </>
  );
};

export default PostGenerator;

/*

import React from "react";
import { Button } from "./ui/button";
import { Plus, PhilippinePeso } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";

const PostGenerator = () => {
  
  return (
    <div className="w-full flex flex-col bg-[#E0DFDB] items-center justify-center p-16 gap-8">
      <div className="flex flex-col items-center justify-center w-full gap-1 text-lg text-center">
        <Button className=" rounded-full md:text-xl p-6 mb-2">
          <Plus />
          Add image
        </Button>
        <p>JPEG / PNG</p>
        <p>You can upload up to 8 MB only</p>
      </div>
      <div className="w-full max-w-3xl mx-auto gap-4 flex flex-col items-center justify-center">
        <div className="w-full gap-2 flex flex-col">
          <Input className="bg-white" placeholder="Title" />
          <Textarea className="bg-white" placeholder="Caption" />
        </div>
        <Input
          className="bg-white"
          placeholder="Type (e.g., Traditional Art)"
        />
        <div className="w-full flex items-center justify-center relative">
          <Input
            className="bg-white relative p-6 pl-9"
            placeholder="Price in Peso"
            type="number"
          />
          <PhilippinePeso className="absolute left-2" color="#666666" />
        </div>
        <Separator className="bg-[#9a9a9a]" />
        <div className="bg-white w-full rounded-lg p-4 flex flex-col gap-8">
          <p>
            Posting works corresponding to the following is prohibited. Please
            check before posting your work.
          </p>
          <div className="text-[#777777] w-full flex flex-col gap-4 px-4">
            <p>
              Works created by others, images that third parties have the rights
              to, works that include captures of games or video works, or
              screenshot images.
            </p>
            <p>
              Works that use the above images and do not make everything by
              yourself from the beginning.
            </p>
          </div>
        </div>
        <p>
          {`Please only upload work that you've created or have permission to
          post.`}
        </p>
        <Button className=" rounded-full md:text-xl px-20 py-6 mt-12">
          Post
        </Button>
      </div>
    </div>
  );
};

export default PostGenerator;


*/

/*

"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Plus, PhilippinePeso } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/actions/post";

interface PostInput {
  title: string;
  image_post_url?: string | null;
  post_description?: string | null;
  art_type: string;
  price?: number | null;
}

const PostGenerator = () => {
  const [price, setPrice] = useState<number | null>(null);
  const [art_type, setArt_type] = useState("");
  const [title, setTitle] = useState("");
  const [post_description, setPost_description] = useState("");
  const [fileType, setFileType] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const imgInputRef = React.useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: PostInput) => createPost(data),
    onSuccess: () => {
      handleSuccess();
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      console.error("Mutation error:", err);
      toast.error("Something went wrong. Try Again!");
    },
  });

  // Use mutation.mutate to execute
  const submitPost = () => {
    if (!title && !selectedFile) {
      showError("Can't make empty post");
      return;
    }

    mutation.mutate({
      title,
      image_post_url: selectedFile,
      post_description: post_description,
      art_type: art_type,
      price: price,
    });
  };

  const handleSuccess = () => {
    setSelectedFile(null);
    setFileType(null);
    setTitle("");
    toast.success("Post created successfully");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];

    // limit to 8MB
    if (file && file.size > 8_000_000) {
      alert("File size exceeds 8 MB");
      return;
    }

    if (file && file.type.startsWith("image/")) {
      setFileType(file.type.split("/")[0]);

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        setSelectedFile(reader.result as string);
      };
    }

    // Handle the file upload logic here
    console.log("Selected file:", file);
    // You can use FormData to send the file to your server if needed
    // const formData = new FormData();
    // formData.append('image', file);
    // fetch('/upload', { method: 'POST', body: formData });
  };
  const showError = (msg: string) => {
    toast.error(msg);
  };

  
  const submitPost = () => {
    if ((title === "" || !title) && !selectedFile) {
      showError("Cant make empty post");
      return;
    }

    execute({title,image_post_url: selectedFile})
  };

  return (
    <div className="w-full flex flex-col bg-[#E0DFDB] items-center justify-center p-16 gap-8">
      <div className="flex flex-col items-center justify-center w-full gap-1 text-lg text-center">
        <Button
          className=" rounded-full md:text-xl p-6 mb-2"
          onClick={() => imgInputRef.current?.click()}
        >
          <Plus />
          Add image
        </Button>
        <p>JPEG / PNG</p>
        <p>You can upload up to 8 MB only</p>
      </div>
      <div className="w-full max-w-3xl mx-auto gap-4 flex flex-col items-center justify-center">
        <div className="w-full gap-2 flex flex-col">
          <Input
            className="bg-white"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            className="bg-white"
            placeholder="Caption"
            value={post_description ?? ""}
            onChange={(e) => setPost_description(e.target.value)}
          />
        </div>
        <Input
          className="bg-white"
          placeholder="Type (e.g., Traditional Art)"
          value={art_type}
          onChange={(e) => setArt_type(e.target.value)}
        />
        <div className="w-full flex items-center justify-center relative">
          <Input
            className="bg-white relative p-6 pl-9"
            placeholder="Price in Peso"
            type="number"
            value={price !== null ? price : ""}
            onChange={(e) => {
              const val = e.target.value;
              setPrice(val === "" ? null : Number(val));
            }}
          />
          <PhilippinePeso className="absolute left-2" color="#666666" />
        </div>
        <Separator className="bg-[#9a9a9a]" />
        <div className="bg-white w-full rounded-lg p-4 flex flex-col gap-8">
          <p>
            Posting works corresponding to the following is prohibited. Please
            check before posting your work.
          </p>
          <div className="text-[#777777] w-full flex flex-col gap-4 px-4">
            <p>
              Works created by others, images that third parties have the rights
              to, works that include captures of games or video works, or
              screenshot images.
            </p>
            <p>
              Works that use the above images and do not make everything by
              yourself from the beginning.
            </p>
          </div>
        </div>
        <p>
          {`Please only upload work that you've created or have permission to
          post.`}
        </p>
        <Button
          className=" rounded-full md:text-xl px-20 py-6 mt-12"
          onClick={submitPost}
        >
          Post
        </Button>
      </div>


      <input
        type="file"
        accept="image/*"
        multiple={false}
        className="hidden"
        ref={imgInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default PostGenerator;

*/
