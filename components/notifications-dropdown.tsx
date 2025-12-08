"use client";

import React, { useState, useEffect } from "react";
import { NotificationType } from "@prisma/client";
import { Skeleton } from "./ui/skeleton";
import UserAvatar from "./user-avatar";
import { createClient } from "@/lib/client";
import { useSafeNavigate } from "@/utils/safeNavigate";
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
};

type Notification = {
  id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  created_at: string;
  fromUser?: UserInfo | null;
  post?: PostInfo | null;
};

interface NotificationsDropdownProps {
  userId: string;
}

export default function NotificationsDropdown({
  userId,
}: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const { safeNavigate } = useSafeNavigate();

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
    // Determine URL for the notification
    let url: string | undefined;
    if (
      n.post &&
      [
        NotificationType.LIKE,
        NotificationType.COMMENT,
        NotificationType.PURCHASE_REQUEST,
        NotificationType.PURCHASE_ACCEPTED,
        NotificationType.PURCHASE_REJECTED,
      ].includes(n.type)
    ) {
      url = `/posts/${n.post.id}`;
    } else if (n.fromUser && n.type === NotificationType.FOLLOW) {
      url = `/users/${n.fromUser.id}?person=${n.fromUser.username}`;
    }

    if (!url) {
      // No URL → just render text
      return (
        <div className="flex items-start gap-2 p-3">
          <UserAvatar
            classNameSizeString={classNameSizeString}
            url={n.fromUser?.image_url}
          />
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
            <span>{n.message}</span>
          </div>
        </div>
      );
    }

    // With URL → wrap in Link + <a> for safeNavigate
    return (
      <Link href={url} passHref>
        <a
          className="flex items-start gap-2 hover:bg-gray-200 p-3 cursor-pointer block"
          onClick={async (e) => {
            e.preventDefault(); // prevent default navigation
            await safeNavigate(url!); // navigate with auth check
          }}
        >
          <div className="flex-shrink-0">
            <UserAvatar
              classNameSizeString={classNameSizeString}
              url={n.fromUser?.image_url}
            />
          </div>
          <div className="flex flex-col gap-0 w-full">
            <div className="flex flex-row justify-between">
              <p className="font-semibold break-words break-all line-clamp-1">
                {n.fromUser?.username || "Someone"}
              </p>
              <p className="text-xs text-gray-500">
                {n.created_at
                  ? new Date(n.created_at).toLocaleDateString()
                  : "Unknown date"}
              </p>
            </div>
            <p className="break-words break-all line-clamp-1 ">
              {n.type === NotificationType.FOLLOW && "started following you"}
              {n.type === NotificationType.LIKE &&
                `liked your post: "${n.post?.title}"`}
              {n.type === NotificationType.COMMENT &&
                `commented on your post: "${n.post?.title}"`}
              {n.type === NotificationType.PURCHASE_REQUEST &&
                `requested to purchase your artwork: "${n.post?.title}"`}
              {n.type === NotificationType.PURCHASE_ACCEPTED &&
                `accepted your purchase request for: "${n.post?.title}"`}
              {n.type === NotificationType.PURCHASE_REJECTED &&
                `rejected your purchase request for: "${n.post?.title}"`}
            </p>
          </div>
        </a>
      </Link>
    );
  };

  return (
    <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto bg-white shadow-lg rounded-lg border border-gray-200 z-50">
      {loading &&
        Array(5)
          .fill(0)
          .map((_, i) => (
            <div className="flex flex-row items-start gap-2 p-3" key={i}>
              <Skeleton className={`${classNameSizeString} rounded-full`} />
              <div className="flex flex-col items-start gap-2 w-full">
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-2 w-4/6" />
                <Skeleton className="h-2 w-2/5" />
              </div>
            </div>
          ))}
      {!loading && notifications.length === 0 && (
        <div className="text-center text-gray-500 py-5">No notifications</div>
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
