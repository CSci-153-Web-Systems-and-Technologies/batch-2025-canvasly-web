"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import NotificationsDropdown from "./notifications-dropdown";

interface Props {
  userId: string;
}

export default function BellButton({ userId }: Props) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`/api/notifications?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      setNotifications(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const res = await fetch(`/api/notifications/read-all`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to mark as read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  // Handle toggle dropdown
  const handleToggle = async () => {
    const willOpen = !open;
    setOpen(willOpen);

    if (willOpen) {
      // Fetch latest notifications and mark all as read
      await fetchNotifications();
      await markAllAsRead();
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications on mount to show red dot initially
  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  // Check if there are unread notifications
  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="ghost" onClick={handleToggle} className="relative">
        <Bell color="#628b35" />
        {hasUnread && (
          <span className="absolute top-0 right-1 block h-3 w-3 rounded-full bg-red-500 ring-1 ring-white" />
        )}
      </Button>

      {open && <NotificationsDropdown userId={userId} />}
    </div>
  );
}
