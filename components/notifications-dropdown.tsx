"use client";

import React, { useState, useEffect } from "react";
import { NotificationType } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserRound } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";

const classNameSizeString = "h-9 w-9";

type UserInfo = {
  id: string;
  username?: string;
  image_url?: string;
};

type PostInfo = {
  id: number;
  title: string;
  image_post_url?: string;
  price?: number;
};

type PurchaseInfo = {
  id: number;
};

type Notification = {
  id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  created_at: string;
  fromUser?: UserInfo | null;
  post?: PostInfo | null;
  purchase?: PurchaseInfo | null;
};

interface NotificationsDropdownProps {
  userId: string;
}

export default function NotificationsDropdown({
  userId,
}: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) fetchNotifications();
  }, [userId]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      if (!userId) return;

      const res = await fetch(`/api/notifications?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch notifications");

      const data = await res.json();
      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderNotificationContent = (n: Notification) => {
    switch (n.type) {
      case NotificationType.FOLLOW:
        return (
          <Link
            passHref
            href={`/users/${n.fromUser?.id}?person=${n.fromUser?.username}`}
          >
            <div className="flex items-start gap-2 hover:bg-gray-200 p-3">
              {n.fromUser?.image_url && (
                <Avatar className={classNameSizeString}>
                  <AvatarImage
                    className="object-cover"
                    src={n.fromUser.image_url}
                    alt="@user"
                  />
                  <AvatarFallback>
                    <UserRound
                      color="#666666"
                      className={classNameSizeString}
                    />
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="flex flex-col gap-0 w-full">
                <div className="flex flex-row justify-between">
                  <span className="font-semibold">
                    {n.fromUser?.username || "Someone"}
                  </span>
                  <p className="text-xs text-gray-500">
                    {n.created_at
                      ? new Date(n.created_at).toLocaleDateString()
                      : "Unknown date"}
                  </p>
                </div>
                started following you
              </div>
            </div>
          </Link>
        );
      case NotificationType.LIKE:
        return (
          <Link href={`/posts/${n.post?.id}`}>
            <div className="flex items-start gap-2 hover:bg-gray-200 p-3">
              {n.fromUser?.image_url && (
                <Avatar className={classNameSizeString}>
                  <AvatarImage
                    className="object-cover"
                    src={n.fromUser.image_url}
                    alt="@user"
                  />
                  <AvatarFallback>
                    <UserRound
                      color="#666666"
                      className={classNameSizeString}
                    />
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="flex flex-col gap-0 w-full">
                <div className="flex flex-row justify-between">
                  <span className="font-semibold">
                    {n.fromUser?.username || "Someone"}
                  </span>
                  <p className="text-xs text-gray-500">
                    {n.created_at
                      ? new Date(n.created_at).toLocaleDateString()
                      : "Unknown date"}
                  </p>
                </div>
                <span>{`liked your post: "${n.post?.title}"`}</span>
              </div>
            </div>
          </Link>
        );
      case NotificationType.COMMENT:
        return (
          <Link href={`/posts/${n.post?.id}`}>
            <div className="flex items-start gap-2 hover:bg-gray-200 p-3">
              {n.fromUser?.image_url && (
                <Avatar className={classNameSizeString}>
                  <AvatarImage
                    className="object-cover"
                    src={n.fromUser.image_url}
                    alt="@user"
                  />
                  <AvatarFallback>
                    <UserRound
                      color="#666666"
                      className={classNameSizeString}
                    />
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="flex flex-col gap-0 w-full">
                <div className="flex flex-row justify-between">
                  <span className="font-semibold">
                    {n.fromUser?.username || "Someone"}
                  </span>
                  <p className="text-xs text-gray-500">
                    {n.created_at
                      ? new Date(n.created_at).toLocaleDateString()
                      : "Unknown date"}
                  </p>
                </div>
                <span>{`commented on your post: "${n.post?.title}"`}</span>
              </div>
            </div>
          </Link>
        );
      case NotificationType.PURCHASE_REQUEST:
        return (
          <Link href={`/posts/${n.post?.id}`}>
            <div className="flex items-start gap-2 hover:bg-gray-200 p-3">
              {n.fromUser?.image_url && (
                <Avatar className={classNameSizeString}>
                  <AvatarImage
                    className="object-cover"
                    src={n.fromUser.image_url}
                    alt="@user"
                  />
                  <AvatarFallback>
                    <UserRound
                      color="#666666"
                      className={classNameSizeString}
                    />
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="flex flex-col gap-0 w-full">
                <div className="flex flex-row justify-between">
                  <span className="font-semibold">
                    {n.fromUser?.username || "Someone"}
                  </span>
                  <p className="text-xs text-gray-500">
                    {n.created_at
                      ? new Date(n.created_at).toLocaleDateString()
                      : "Unknown date"}
                  </p>
                </div>

                <span>{`requested to purchase your artwork: "${n.post?.title}"`}</span>
              </div>
            </div>
          </Link>
        );
      case NotificationType.PURCHASE_ACCEPTED:
        return (
          <Link href={`/posts/${n.post?.id}`}>
            <div className="flex items-start gap-2 hover:bg-gray-200 p-3">
              {n.fromUser?.image_url && (
                <Avatar className={classNameSizeString}>
                  <AvatarImage
                    className="object-cover"
                    src={n.fromUser.image_url}
                    alt="@user"
                  />
                  <AvatarFallback>
                    <UserRound
                      color="#666666"
                      className={classNameSizeString}
                    />
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="flex flex-col gap-0 w-full">
                <div className="flex flex-row justify-between">
                  <span className="font-semibold">
                    {n.fromUser?.username || "Someone"}
                  </span>
                  <p className="text-xs text-gray-500">
                    {n.created_at
                      ? new Date(n.created_at).toLocaleDateString()
                      : "Unknown date"}
                  </p>
                </div>
                <span>{`accepted your purchase request for: "${n.post?.title}"`}</span>
              </div>
            </div>
          </Link>
        );
      case NotificationType.PURCHASE_REJECTED:
        return (
          <Link href={`/posts/${n.post?.id}`}>
            <div className="flex items-start gap-2 hover:bg-gray-200 p-3">
              {n.fromUser?.image_url && (
                <Avatar className={classNameSizeString}>
                  <AvatarImage
                    className="object-cover"
                    src={n.fromUser.image_url}
                    alt="@user"
                  />
                  <AvatarFallback>
                    <UserRound
                      color="#666666"
                      className={classNameSizeString}
                    />
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="flex flex-col gap-0 w-full">
                <div className="flex flex-row justify-between">
                  <span className="font-semibold">
                    {n.fromUser?.username || "Someone"}
                  </span>
                  <p className="text-xs text-gray-500">
                    {n.created_at
                      ? new Date(n.created_at).toLocaleDateString()
                      : "Unknown date"}
                  </p>
                </div>
                <span>{`rejected your purchase request for: "${n.post?.title}"`}</span>
              </div>
            </div>
          </Link>
        );
      default:
        return <p>{n.message}</p>;
    }
  };

  return (
    <div className=" absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto bg-white shadow-lg rounded-lg border border-gray-200 z-50">
      {loading &&
        Array(5)
          .fill(0)
          .map((_, i) => (
            <div
              className="flex flex-row items-start gap-2 py-1.5 p-1.5"
              key={i}
            >
              <Skeleton className="h-6 w-6 rounded-full" />
              <div className="flex flex-col items-start gap-2 w-full">
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-2 w-4/6" />
                <Skeleton className="h-2 w-2/5" />
              </div>
            </div>
          ))}
      {!loading && notifications.length === 0 && (
        <div className=" text-center text-gray-500 py-5">No notifications</div>
      )}
      <ul>
        {notifications.map((n) => (
          <li key={n.id}>
            <div
              className={`text-sm ${n.read ? "text-gray-400" : "text-black"}`}
            >
              {renderNotificationContent(n)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
