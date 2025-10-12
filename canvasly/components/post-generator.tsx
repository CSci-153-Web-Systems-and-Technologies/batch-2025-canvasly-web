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
        <p>You can upload up to 16 MB only</p>
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
