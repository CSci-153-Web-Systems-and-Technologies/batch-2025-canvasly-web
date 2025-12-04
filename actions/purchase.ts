// /actions/purchase.ts

import { db } from "@/lib/db"; // adjust import based on your project

/**
 * Create a purchase request for a post
 */
export async function createPurchaseRequest(postId: number, buyerId: string) {
  // Fetch post to get seller
  const post = await db.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  });

  if (!post) throw new Error("Post not found.");
  if (post.authorId === buyerId)
    throw new Error("Cannot purchase your own artwork.");

  // Check if already purchased
  const existing = await db.purchase.findFirst({
    where: { postId, buyerId },
  });
  if (existing) throw new Error("Already purchased.");

  const purchase = await db.purchase.create({
    data: {
      postId,
      buyerId,
      sellerId: post.authorId,
      status: "PENDING",
    },
  });

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

  await db.purchase.delete({
    where: { id: existing.id },
  });

  return true;
}

export async function acceptPurchase(purchaseId: number, sellerId: string) {
  // Ensure purchase exists and belongs to seller
  const purchase = await db.purchase.findUnique({
    where: { id: purchaseId },
  });

  if (!purchase) throw new Error("Purchase request not found.");
  if (purchase.sellerId !== sellerId)
    throw new Error("You are not authorized to accept this request.");

  return await db.purchase.update({
    where: { id: purchaseId },
    data: { status: "ACCEPTED" },
  });
}

export async function rejectPurchase(purchaseId: number, sellerId: string) {
  const purchase = await db.purchase.findUnique({
    where: { id: purchaseId },
  });

  if (!purchase) throw new Error("Purchase request not found.");
  if (purchase.sellerId !== sellerId)
    throw new Error("You are not authorized to reject this request.");

  return await db.purchase.update({
    where: { id: purchaseId },
    data: { status: "REJECTED" },
  });
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
