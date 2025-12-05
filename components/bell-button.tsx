"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  userId: string;
}

export default function BellButton({ userId }: Props) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`/api/notifications?userId=${userId}`);
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  return (
    <div className="relative rounded-full">
      <Button
        variant="ghost"
        onClick={() => {
          setOpen(!open);
          if (!open) fetchNotifications();
        }}
      >
        <Bell color="#628b35" />
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white shadow-md rounded-md p-2 z-50">
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="border-b py-2">
                <p className="text-sm">{n.message}</p>
                <p className="text-xs text-gray-400">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
