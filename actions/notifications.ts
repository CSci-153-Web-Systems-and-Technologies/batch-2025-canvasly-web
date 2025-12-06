import { db } from "@/lib/db";
import { NotificationType } from "@prisma/client";

// -------------------------------
// Notifications Database Functions
// -------------------------------

// Get all notifications for a specific user
export async function getNotifications(userId: string) {
  const notifications = await db.notification.findMany({
    where: { userId },
    include: {
      fromUser: true,
      post: true,
      purchase: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Convert Date objects to ISO strings
  return notifications.map((n) => ({
    ...n,
    created_at: n.createdAt.toISOString(),
  }));
}

// Mark a single notification as read
export async function markNotificationRead(id: number) {
  return db.notification.update({
    where: { id },
    data: { read: true, readAt: new Date() },
  });
}

// Delete a single notification
export async function deleteNotification(id: number) {
  return db.notification.delete({
    where: { id },
  });
}

// Mark all notifications for a user as read
export async function markAllRead(userId: string) {
  return db.notification.updateMany({
    where: { userId, read: false },
    data: { read: true, readAt: new Date() },
  });
}

// Create a new notification
export async function createNotification({
  userId,
  fromUserId,
  type,
  postId,
  purchaseId,
  message,
}: {
  userId: string;
  fromUserId?: string;
  type: NotificationType; // <--- type-safe
  postId?: number;
  purchaseId?: number;
  message: string;
}) {
  return db.notification.create({
    data: {
      userId,
      fromUserId,
      type,
      postId,
      purchaseId,
      message,
    },
  });
}
