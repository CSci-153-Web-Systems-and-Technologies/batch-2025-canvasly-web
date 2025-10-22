"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import { User } from "@supabase/supabase-js";

const CurrentUserAvatarProfile = ({
  classNameAvatar,
  classNameUseRound,
}: {
  classNameAvatar: string;
  classNameUseRound: string;
}) => {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [image_url, set_image_url] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      // 1. Get the user first
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error fetching user:", userError);
        return; // Stop if there's an error or no user
      }

      setUser(user); // Set the user for the UI

      // 2. NOW that we have the user, get the image URL
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("image_url")
        .eq("id", user.id) // Use user.id directly
        .single();

      if (profileError) {
        console.error("Error fetching user profile:", profileError.message);
      } else if (profileData) {
        set_image_url(profileData.image_url);
      }
    };

    fetchAllData();
  }, [supabase]); // The dependency array only needs `supabase`

  if (!user) {
    return <p>You are not logged in.</p>;
  }

  if (user && image_url) {
    return (
      <div className={classNameAvatar}>
        <Avatar className={classNameAvatar}>
          <AvatarImage className="object-cover" src={image_url} alt="@user" />
          <AvatarFallback>
            <UserRound color="#666666" className={classNameUseRound} />
          </AvatarFallback>
        </Avatar>
      </div>
    );
  } else if (user && !image_url) {
    return (
      <div className={classNameAvatar}>
        <Avatar className={classNameAvatar}>
          <AvatarImage alt="@user" />
          <AvatarFallback>
            <UserRound color="#666666" className={classNameUseRound} />
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }
};

export default CurrentUserAvatarProfile;
