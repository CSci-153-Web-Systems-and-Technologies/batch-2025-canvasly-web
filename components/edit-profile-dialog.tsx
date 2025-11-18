"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/client";
import { User } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import { updateUserProfile } from "@/actions/user";
import { Spinner } from "./ui/spinner";

const EditProfileDialog = ({ userId, isLoading, data, isError }) => {
  const supabase = createClient();
  const inputRef = useRef(null);

  // const [fetchedImageURL, setFetchedImageURL] = useState<string | null>(null);
  //const [fetchedDescription, setFetchedDescription] = useState<string>("");
  //const [fetchedUsername, setFetchedUsername] = useState<string>("");

  const [userAuth, setUserAuth] = useState<User | null>(null);
  //const [userId, setUserId] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [image_url, set_image_url] = useState(null);
  const [username, setUsername] = useState<string>("");

  const { mutate, isPending } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      toast.success("User updated successfully!");
    },
    onError: () => {
      toast.error("Something wrong happned. Try again!");
    },
  });

  useEffect(() => {
    const fetchUserAuth = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.log(error);
        return;
      }

      setUserAuth(user);
    };
    fetchUserAuth();
  }, []);

  useEffect(() => {
    if (data?.data?.image_url) {
      set_image_url(data?.data?.image_url);
    }
  }, [data?.data?.image_url]);

  useEffect(() => {
    setDescription(data?.data?.description);
    setUsername(data?.data?.username);
  }, []);

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // limit to 4MB
    if (file && file.size > 4_000_000) {
      toast.error("File size exceeds 4 MB");
      return;
    }

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        set_image_url(reader.result);
      };
    }
  };

  const saveChanges = async () => {
    mutate({
      id: userAuth?.id,

      image: image_url,
      prevImageId: data?.data?.image_id,
      description: description,
      username: username,
    });
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="rounded-md sm:rounded-full md:text-xl p-1 text-xs md:p-6 sm:p-3"
          >
            Edit profile
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex mx-auto relative">
              <Avatar className="md:w-24 md:h-24 w-14 h-14 relative object-cover">
                {isPending && <Spinner />}

                <AvatarImage
                  className="object-cover"
                  src={image_url}
                  alt="@user"
                />
                <AvatarFallback>
                  {data?.data?.image_url ? (
                    <AvatarImage
                      className="object-cover"
                      src={data?.data?.image_url}
                      alt="@user"
                    />
                  ) : (
                    <UserRound
                      color="#666666"
                      className="md:w-14 md:h-14 w-10 h-10"
                    />
                  )}
                </AvatarFallback>
              </Avatar>
              <Button
                className="rounded-full absolute bottom-0 right-0  h-6 w-6 md:h-10 md:w-10"
                variant="outline"
                size="icon"
                onClick={() => inputRef.current.click()}
              >
                <input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  multiple={false}
                  ref={inputRef}
                  onChange={(e) => handleImageChange(e)}
                />
                <Pencil color="#666666" />
              </Button>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input
                id="username-1"
                name="username"
                value={username}
                onChange={(e) => handleUsernameChange(e)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description-1">Description</Label>
              <Textarea
                id="description-1"
                name="description"
                value={description ?? ""}
                onChange={(e) => handleDescriptionChange(e)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" onClick={() => saveChanges()}>
                Save changes
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default EditProfileDialog;
