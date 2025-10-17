// Remember to add this at the top of the file if you're using Next.js App Router
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // Your Supabase client
import type { User } from "@supabase/supabase-js";
import HeartIcon from "./ui/heart-icon";

export default function HeartContainer({ postId, likes, queryId }) {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
  }, [supabase]); // The empty array ensures this runs only once on component mount

  if (loading) {
    return <p>Loading user information...</p>;
  }

  if (user) {
    return <HeartIcon postId={postId} likes={likes} queryId={queryId} />;
  }

  return (
    <div className="flex flex-row justify-center items-center">
      <button
        className="flex items-center justify-center rounded-full h-10 w-10 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500 hover:bg-gray-100"
        aria-label="Like post"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 text-gray-600"
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
}
