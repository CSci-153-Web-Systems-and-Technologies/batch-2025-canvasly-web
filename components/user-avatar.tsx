import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserRound } from "lucide-react";

const UserAvatar = ({
  classNameSizeString,
  url,
}: {
  classNameSizeString: string;
  url: string | undefined;
}) => {
  if (url) {
    return (
      <Avatar className={classNameSizeString}>
        <AvatarImage className="object-cover" src={url} alt="@user" />
        <AvatarFallback>
          <UserRound color="#666666" className={classNameSizeString} />
        </AvatarFallback>
      </Avatar>
    );
  } else if (!url) {
    return (
      <div className={classNameSizeString}>
        <Avatar className={classNameSizeString}>
          <AvatarImage alt="@user" />
          <AvatarFallback>
            <UserRound color="#666666" className={classNameSizeString} />
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }
};

export default UserAvatar;
