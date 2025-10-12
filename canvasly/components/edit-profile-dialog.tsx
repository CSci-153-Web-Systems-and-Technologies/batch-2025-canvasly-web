import React from "react";
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

const EditProfileDialog = () => {
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
              <Avatar className="md:w-24 md:h-24 w-14 h-14 ">
                <AvatarImage alt="@user" />
                <AvatarFallback>
                  <UserRound
                    color="#666666"
                    className="md:w-14 md:h-14 w-10 h-10"
                  />
                </AvatarFallback>
              </Avatar>
              <Button
                className="rounded-full absolute bottom-0 right-0"
                variant="outline"
                size="icon"
              >
                <Pencil color="#666666" />
              </Button>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description-1">Description</Label>
              <Textarea id="description-1" name="description" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default EditProfileDialog;
