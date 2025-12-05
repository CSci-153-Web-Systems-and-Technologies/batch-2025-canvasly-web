"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
//import { createClient } from "@supabase/auth-helpers-nextjs"; // or your supabase client helper

type Notification = {
  id: string;
  message: string;
  created_at: string;
  read: boolean;
};

interface NotificationsDropdownProps {
  userId: any;
}

export default function NotificationsDropdown({
  userId,
}: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  console.log("NOTIF DROPDOWN AuthButton user id:", userId);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      console.log("Fetching notifications for userId:", userId);

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("userId", userId) // <-- match the DB column exactly
        .order("createdAt", { ascending: false }) // Prisma createdAt → likely DB column "createdAt"
        .limit(20);

      console.log("Supabase data:", data);
      console.log("Supabase error:", error);

      if (error) throw error;

      setNotifications(data || []);
    } catch (err) {
      console.error(
        "Failed to fetch notifications:",
        JSON.stringify(err, null, 2)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto bg-white shadow-lg rounded-lg border border-gray-200 z-50 flex items-center justify-center">
      {loading && <div className="p-4">Loading...</div>}
      {!loading && notifications.length === 0 && (
        <div className="p-4 text-center text-gray-500 w-full flex items-center justify-center">
          No notifications
        </div>
      )}
      <ul>
        {notifications.map((n) => (
          <li key={n.id} className="border-b last:border-b-0 p-2">
            <p className={`text-sm ${n.read ? "text-gray-400" : "text-black"}`}>
              {n.message}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(n.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
