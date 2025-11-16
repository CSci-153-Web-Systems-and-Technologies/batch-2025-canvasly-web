"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import CommentInput from "./comment-input";
import Comment from "./comment";
import { ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useAutoAnimate } from "@formkit/auto-animate/react";
//import { animateScroll } from "react-scroll";
import { Skeleton } from "./ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

const CommentSection = ({ comments, postId, queryId }) => {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [parent] = useAutoAnimate();

  useEffect(() => {
    const checkUser = async () => {
      // This function gets the current user from the session
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkUser();
  }, []); // The empty array ensures this runs only once on component mount

  if (loading) {
    return (
      <div className="flex flex-row justify-between w-full">
        <Skeleton className="h-4 w-20 sm:w-24 md:w-24 lg:w-32" />
        <Skeleton className=" h-4 w-20 sm:w-24 md:w-24 lg:w-32" />
        <Skeleton className="h-4 w-20 sm:w-24 md:w-24 lg:w-32" />
      </div>
    );
  }

  console.log(`⚠️ COMMENT-SECTION.TSX ${postId}`);

  return (
    <div className="flex flex-col w-full gap-2">
      {comments?.length > 1 && (
        <div className="flex flex-col gap-4">
          <Button
            className=" p-6"
            variant="ghost"
            onClick={() => setExpanded((prev) => !prev)}
          >
            <div className="flex flex-row justify-center items-center gap-2">
              <ChevronDown color="#303030" />
              <span>Show more comments</span>
              <div className="py-0.5 px-3 flex flex-row items-center justify-center rounded-2xl  bg-[#8c8c8c] text-white">{`${comments?.length}`}</div>
            </div>
          </Button>
        </div>
      )}
      {comments?.length > 0 && (
        <div
          ref={parent}
          id="comments-container"
          className="flex flex-col gap-2"
        >
          {!expanded ? (
            <Comment data={comments[comments.length - 1]} />
          ) : (
            <ScrollArea className="h-72 w-full">
              {comments.map((comment, index) => (
                <Comment data={comment} key={index} />
              ))}
            </ScrollArea>
          )}
        </div>
      )}

      {user && (
        <CommentInput
          setExpanded={setExpanded}
          postId={postId}
          queryId={queryId}
        />
      )}
    </div>
  );
};

export default CommentSection;
