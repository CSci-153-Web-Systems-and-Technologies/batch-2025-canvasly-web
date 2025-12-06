// /actions/purchase.ts

import { NotificationType } from "@prisma/client";
import { db } from "@/lib/db"; // adjust import based on your project
import { createNotification } from "./notifications"; // adjust path if needed
import { createClient } from "@/lib/supabase/server";
/**
 * Create a purchase request for a post
 */
export async function createPurchaseRequest(postId: number, buyerId: string) {
  const supabase = await createClient();
  // Fetch post to get seller
  const post = await db.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  });

  if (!post) throw new Error("Post not found.");
  if (post.authorId === buyerId)
    throw new Error("Cannot purchase your own artwork.");

  const existing = await db.purchase.findFirst({ where: { postId, buyerId } });
  if (existing) throw new Error("Already purchased.");

  const purchase = await db.purchase.create({
    data: { postId, buyerId, sellerId: post.authorId, status: "PENDING" },
  });

  // Create notification for the seller
  if (post.authorId !== buyerId) {
    const { data: profileData } = await supabase
      .from("users")
      .select("username")
      .eq("id", buyerId)
      .single();

    await createNotification({
      userId: post.authorId, // seller
      fromUserId: buyerId, // buyer
      type: NotificationType.PURCHASE_REQUEST,
      purchaseId: purchase.id,
      postId: postId,
      message: `${
        profileData?.username || "Someone"
      } requested a purchase to your Artwork`,
    });
  }

  return purchase;
}

/**
 * Cancel a purchase request
 */
export async function cancelPurchaseRequest(postId: number, buyerId: string) {
  const existing = await db.purchase.findFirst({
    where: { postId, buyerId },
  });

  if (!existing) throw new Error("No purchase request to cancel.");

  // Delete the purchase
  await db.purchase.delete({
    where: { id: existing.id },
  });

  // Remove related notification
  await db.notification.deleteMany({
    where: {
      purchaseId: existing.id, // notification tied to this purchase
      fromUserId: buyerId, // from the buyer who made the request
      type: "PURCHASE_REQUEST", // optional: only target purchase notifications
    },
  });

  console.log("✅ Purchase request canceled and notification removed");

  return true;
}

export async function acceptPurchase(purchaseId: number, sellerId: string) {
  const supabase = await createClient();
  const purchase = await db.purchase.findUnique({ where: { id: purchaseId } });
  if (!purchase) throw new Error("Purchase request not found.");
  if (purchase.sellerId !== sellerId) throw new Error("Not authorized.");

  const updated = await db.purchase.update({
    where: { id: purchaseId },
    data: { status: "ACCEPTED" },
  });

  // Notify buyer
  if (purchase.buyerId !== sellerId) {
    const { data: profileData } = await supabase
      .from("users")
      .select("username")
      .eq("id", sellerId)
      .single();

    await createNotification({
      userId: purchase.buyerId,
      fromUserId: sellerId,
      type: NotificationType.PURCHASE_ACCEPTED,
      purchaseId: purchase.id,
      postId: purchase.postId,
      message: `${
        profileData?.username || "Someone"
      } accepted your purchase request`,
    });
  }

  return updated;
}

export async function rejectPurchase(purchaseId: number, sellerId: string) {
  const supabase = await createClient();
  const purchase = await db.purchase.findUnique({ where: { id: purchaseId } });
  if (!purchase) throw new Error("Purchase request not found.");
  if (purchase.sellerId !== sellerId) throw new Error("Not authorized.");

  const updated = await db.purchase.update({
    where: { id: purchaseId },
    data: { status: "REJECTED" },
  });

  // Notify buyer
  if (purchase.buyerId !== sellerId) {
    const { data: profileData } = await supabase
      .from("users")
      .select("username")
      .eq("id", sellerId)
      .single();

    await createNotification({
      userId: purchase.buyerId,
      fromUserId: sellerId,
      type: NotificationType.PURCHASE_REJECTED,
      purchaseId: purchase.id,
      postId: purchase.postId,
      message: `${
        profileData?.username || "Someone"
      } rejected your purchase request`,
    });
  }

  return updated;
}

export async function getMyRequests(
  sellerId: string,
  take: number = 10,
  cursor?: number
) {
  // Fetch one extra to check if there's a next page
  const requests = await db.purchase.findMany({
    where: { sellerId, status: "PENDING" },
    orderBy: { createdAt: "desc" },
    take: take + 1,
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,

    include: {
      // Fetch buyer info (same as seller info in getMyPurchases)
      buyer: {
        select: {
          id: true,
          username: true,
          image_url: true,
        },
      },

      // Fetch selected post fields
      post: {
        select: {
          id: true,
          price: true,
          title: true,
          art_type: true,
          image_post_url: true,
        },
      },
    },
  });

  // Pagination logic
  let nextCursor: number | null = null;
  if (requests.length > take) {
    const nextItem = requests.pop(); // remove extra item
    nextCursor = nextItem!.id;
  }

  return { requests, nextCursor };
}

export async function getMyPurchases(
  buyerId: string,
  take: number = 10,
  cursor?: number
) {
  // Fetch one extra record to determine if there's a next page
  const purchases = await db.purchase.findMany({
    where: { buyerId },
    orderBy: { createdAt: "desc" },
    take: take + 1,
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
    include: {
      post: {
        select: {
          id: true,
          price: true,
          title: true,
          art_type: true,
          image_post_url: true,
        },
      },

      // ✅ Select seller username + image_url
      seller: {
        select: {
          id: true,
          username: true,
          image_url: true, // <-- Added here
        },
      },
    },
  });

  // Pagination cursor logic
  let nextCursor: number | null = null;
  if (purchases.length > take) {
    const nextItem = purchases.pop(); // remove the extra item
    nextCursor = nextItem!.id;
  }

  return { purchases, nextCursor };
}
