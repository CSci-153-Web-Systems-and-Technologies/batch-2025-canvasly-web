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
  }, []); // The empty array ensures this runs only once on component mount

  if (loading) {
    return <p>Loading user information...</p>;
  }

  if (user) {
    return <HeartIcon postId={postId} likes={likes} queryId={queryId} />;
  }

  return <div className="hidden"></div>;
}
