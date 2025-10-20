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
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error(
          "CURRENT-USER-AVATAR-PROFILE.TSX Error fetching user:",
          error
        );
      } else {
        setUserId(data.user.id);
        setUser(data.user);
      }
    };

    fetchUser();

    const fetchImageURL = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("image_url") // You only need the image_url here
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching user profile:", error.message);
        } else {
          set_image_url(data.image_url);
        }
      }
    };
    fetchImageURL();
  }, [userId, user]);

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
