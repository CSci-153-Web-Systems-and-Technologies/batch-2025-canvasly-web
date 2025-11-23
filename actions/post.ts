"use server";

import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { PostInput } from "@/lib/constants";
import { checkPostForTrends } from "@/utils";
import { getAllFollowersAndFollowingsInfo } from "./user";
import { uploadFile, deleteFile } from "./uploadFile";
//import { useEffect } from "react";

interface UpdatePostParams {
  id: number;
  title?: string;
  post_description?: string;
  art_type?: string;
  price?: number | null;
  image_post_url?: string;
  prevImageId?: string | null;
}

const PAGE_SIZE = 4;

export const createPost = async (post: PostInput) => {
  try {
    console.log("🟢POSTS.TS createPost called with:", post);

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("❌POSTS.TS Supabase userError:", userError.message);
      throw new Error("Failed to get authenticated user");
    }

    if (!user?.id) {
      console.error("⚠️POSTS.TS No authenticated user found");
      throw new Error("User not authenticated");
    }

    console.log("✅POSTS.TS Authenticated user ID:", user.id);

    if (post.image_post_url) {
      console.log("📤POSTS.TS Uploading image to Cloudinary...");
      const res = await uploadFile({
        file: post.image_post_url,
        folder: `/posts/${user.id}`,
      });
      console.log("📸 Cloudinary response:", res);

      if ("error" in res) {
        throw new Error(res.error);
      }

      const { public_id, secure_url } = res;
      post.cld_id = public_id;
      post.image_post_url = secure_url;
    }

    const newPost = await db.post.create({
      data: {
        title: post.title,
        image_post_url: post.image_post_url,
        post_description: post.post_description ?? null,
        art_type: post.art_type,
        price: post.price ?? null,
        cld_id: post.cld_id ?? null,
        author: {
          connect: { id: user.id },
        },
      },
      include: {
        author: true,
      },
    });

    const trends = checkPostForTrends(post.post_description);
    if (trends.length > 0) {
      createTrends(trends, newPost.id);
    }

    console.log("✅ Prisma created new post:", newPost);
    return { data: newPost };
  } catch (err) {
    console.error("❌ createPost error:", err);
    throw err;
  }
};

export const getMyArtwork = async ({ cursor = 0, userId }) => {
  // `cursor` is now the numeric offset (0, 5, 10, ...)
  // `userId` is the ID of the profile being viewed

  try {
    const posts = await db.post.findMany({
      // 2. This is the 15.7 GB Egress Fix
      // Add the WHERE clause to filter by user
      where: {
        authorId: userId, // Make sure `authorId` matches your Prisma schema
      },

      // 3. This is the Egress Optimization
      // Use `_count` instead of `include` to get numbers, not all data.
      select: {
        id: true,
        title: true,
        image_post_url: true, // or whatever your image field is
        createdAt: true,
        authorId: true,
        // This is much, much smaller than including all like/comment records
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },

      // 4. This is the Prisma Error Fix
      // Use `skip` (offset) for pagination, not cursor
      take: PAGE_SIZE,
      skip: cursor, // `cursor` is the offset (0, 5, 10...)

      orderBy: {
        createdAt: "desc",
      },
    });

    // 5. Set the next cursor for infinite scroll
    const nextCursor = posts.length === PAGE_SIZE ? cursor + PAGE_SIZE : null;

    return {
      data: posts,
      metaData: {
        lastCursor: nextCursor,
      },
    };
  } catch (e) {
    console.log(e);
    // Return a valid shape on error so the app doesn't crash
    return { data: [], metaData: { lastCursor: null } };
  }
};

export const getMyFeedPosts = async (lastCursor) => {
  try {
    const take = 5;
    const posts = await db.post.findMany({
      include: {
        author: true,
        likes: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
      take: take,
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor,
        },
      }),
      orderBy: {
        createdAt: "desc",
      },
    });

    if (posts.length === 0) {
      return {
        data: [],
        metadata: {
          lastCursor: null,
          hasMore: false,
        },
      };
    }

    const lastPostInResults = posts[posts.length - 1];
    const cursor = lastPostInResults.id;
    const morePosts = await db.post.findMany({
      skip: 1,
      take: take,
      cursor: {
        id: cursor,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      data: posts,
      metaData: {
        lastCursor: cursor,
        hasMore: morePosts.length > 0,
      },
    };
  } catch (e) {
    console.log(e);
    throw new Error("Failed to fetch the posts");
  }
};

export const getMyFeedPostsFollowing = async (lastCursor) => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { following } = await getAllFollowersAndFollowingsInfo(user?.id);

    const followingIds = following
      .map((f) => f.followingId)
      .filter((id): id is string => Boolean(id));

    const take = 5;

    //const where = { author: { id: userIds } };

    const where = {
      authorId: {
        in: followingIds,
        not: user?.id,
      },
    };

    const posts = await db.post.findMany({
      include: {
        author: true,
        likes: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
      where,
      take: take,
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor,
        },
      }),
      orderBy: {
        createdAt: "desc",
      },
    });

    if (posts.length === 0) {
      return {
        data: [],
        metadata: {
          lastCursor: null,
          hasMore: false,
        },
      };
    }

    const lastPostInResults = posts[posts.length - 1];
    const cursor = lastPostInResults.id;
    const morePosts = await db.post.findMany({
      where,
      skip: 1,
      take: take,
      cursor: {
        id: cursor,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      data: posts,
      metaData: {
        lastCursor: cursor,
        hasMore: morePosts.length > 0,
      },
    };
  } catch (e) {
    console.log(e);
    throw new Error("Failed to fetch the posts");
  }
};

export const updatePostLike = async (params) => {
  const { postId, actionType: type } = params;

  console.log("POST.TS TAN AWA TYPE", postId, type);
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error(
        "❌ updatePostLike POSTS.TS Supabase userError:",
        userError.message
      );
      throw new Error("Failed to get authenticated user");
    }

    if (!user?.id) {
      console.error("⚠️updatePostLike POSTS.TS No authenticated user found");
      throw new Error("User not authenticated");
    }

    console.log("✅updatePostLike POSTS.TS Authenticated user ID:", user.id);

    const userId = user?.id;

    const post = await db.post.findMany({
      where: {
        id: postId,
      },
      include: {
        likes: true,
      },
    });

    if (!post) {
      return {
        error: "updatePostLike POSTS.TS Post not Found!",
      };
    }

    // First, check if the array has at least one item
    const firstPost = post[0];
    let like;

    if (firstPost) {
      // Now access .likes on the single post object
      like = firstPost.likes.find((like) => like?.authorId === userId);
    }

    if (like) {
      if (type === "like") {
        return {
          data: post,
        };
      } else {
        await db.like.delete({
          where: {
            id: like.id,
          },
        });

        console.log("✅ like deleted!");
      }
    } else {
      if (type === "unlike") {
        return {
          data: post,
        };
      } else {
        await db.like.create({
          data: {
            post: {
              connect: {
                id: postId,
              },
            },
            author: {
              connect: {
                id: userId,
              },
            },
          },
        });
        console.log("✅ like created!");
      }
    }

    const updatedPost = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        likes: true,
      },
    });

    console.log("✅ POSTS.TS ", updatedPost);
    return {
      data: updatedPost,
    };
  } catch (e) {
    console.log(e);
    throw new Error("❌ POSTS.TS Failed to update the post likes");
  }
};

export const addComment = async ({
  comment,
  postId,
}: {
  comment: string;
  postId: number;
}) => {
  try {
    console.log(`⚠️ POSTS.TS ${comment},${postId}`);
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error(
        "❌ updatePostLike POSTS.TS Supabase userError:",
        userError.message
      );
      throw new Error("Failed to get authenticated user");
    }

    if (!user?.id) {
      console.error("⚠️updatePostLike POSTS.TS No authenticated user found");
      throw new Error("User not authenticated");
    }

    console.log("✅updatePostLike POSTS.TS Authenticated user ID:", user.id);

    const userId = user?.id;

    const newComment = await db.comment.create({
      data: {
        comment,
        post: {
          connect: {
            id: postId,
          },
        },
        author: {
          connect: {
            id: userId,
          },
        },
      },
    });
    console.log("✅ POSTS.TS created comment!", newComment);
    return {
      data: newComment,
    };
  } catch (e) {
    console.log(e);
    throw new Error("❌POSTS.TS Failed to add comment");
  }
};

export const createTrends = async (trends, postId) => {
  try {
    const newTrends = await db.trend.createMany({
      data: trends.map((trend) => ({
        name: trend,
        postId: postId,
      })),
    });

    return {
      data: newTrends,
    };
  } catch (e) {
    throw e;
  }
};

export const getPopularTrebds = async () => {
  try {
    const trends = await db.trend.groupBy({
      by: ["name"],
      _count: {
        name: true,
      },
      orderBy: {
        _count: {
          name: "desc",
        },
      },
      take: 5,
    });

    return {
      data: trends,
    };
  } catch (e) {
    throw e;
  }
};

export const getPostById = async (id: number) => {
  try {
    const post = await db.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        image_post_url: true,
        price: true,
        art_type: true,
        post_description: true,
        createdAt: true,
        authorId: true,
        // fetch post author info
        author: {
          select: {
            id: true,
            username: true,
            image_url: true,
            description: true,
          },
        },
        // fetch comments with author info
        comments: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            comment: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                username: true,
                image_url: true,
              },
            },
          },
        },
        likes: {
          select: { id: true, authorId: true },
        },
      },
    });

    return { data: post };
  } catch (e) {
    console.log(e);
    return { error: "Error fetching post" };
  }
};

export const getPostByIdWithCLI_ID = async (id: number) => {
  try {
    const post = await db.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        image_post_url: true,
        cld_id: true, // <--- add this
        price: true,
        art_type: true,
        post_description: true,
        createdAt: true,
        authorId: true,
        author: {
          select: {
            id: true,
            username: true,
            image_url: true,
            description: true,
          },
        },
        comments: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            comment: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                username: true,
                image_url: true,
              },
            },
          },
        },
        likes: {
          select: { id: true, authorId: true },
        },
      },
    });

    return { data: post };
  } catch (e) {
    console.log(e);
    return { error: "Error fetching post" };
  }
};

export const searchPosts = async (query: string) => {
  try {
    if (!query || query.trim().length === 0) {
      return { data: [] };
    }

    const posts = await db.post.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive", // case-insensitive search
        },
      },
      select: {
        id: true,
        title: true,
        image_post_url: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
            image_url: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20, // limit for safety
    });

    return { data: posts };
  } catch (e) {
    console.log(e);
    return { error: "Search failed" };
  }
};

export const updatePost = async (params: UpdatePostParams) => {
  const {
    id,
    title,
    post_description,
    art_type,
    price,
    image_post_url,
    prevImageId,
  } = params;

  try {
    let image_url = image_post_url;
    let cld_id: string | undefined = prevImageId;

    // Upload new image if provided as base64
    if (image_post_url && image_post_url.startsWith("data:")) {
      const uploadRes = await uploadFile({
        file: image_post_url,
        folder: `posts/${id}`,
      });
      image_url = uploadRes.secure_url;
      cld_id = uploadRes.public_id;

      if (prevImageId) {
        await deleteFile(prevImageId); // delete previous image
      }
    }

    // Update the post
    const updatedPost = await db.post.update({
      where: { id },
      data: {
        title,
        post_description,
        art_type,
        price,
        ...(image_url && { image_post_url: image_url }),
        ...(cld_id && { cld_id }),
      },
    });

    // Update trends
    if (post_description) {
      // Delete existing trends for this post
      await db.trend.deleteMany({
        where: { postId: id },
      });

      // Extract trends from updated description
      const newTrends = checkPostForTrends(post_description);

      if (newTrends.length > 0) {
        await db.trend.createMany({
          data: newTrends.map((trend) => ({
            name: trend,
            postId: id,
          })),
        });
      }
    }

    return updatedPost;
  } catch (error) {
    console.error("UPDATE_POST_ERROR:", error);
    throw error;
  }
};

export const deletePostById = async (id: number) => {
  try {
    // Fetch the post to get the Cloudinary ID
    const post = await db.post.findUnique({
      where: { id },
      select: { cld_id: true },
    });

    if (!post) return { error: "Post not found" };

    // Delete the Cloudinary image if exists
    if (post.cld_id) {
      await deleteFile(post.cld_id);
    }

    // Delete the post itself; related likes, comments, and trends are deleted automatically via cascade
    await db.post.delete({ where: { id } });

    return { success: true };
  } catch (error) {
    console.error("DELETE_POST_ERROR:", error);
    return { error: "Failed to delete post" };
  }
};

/*
"use server";

import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { uploadFile } from "./uploadFile";

interface PostInput {
  title: string;
  image_post_url: string;
  post_description?: string | null;
  art_type: string;
  price?: number | null;
  cld_id?: string | null;
}

export const createPost = async (post: PostInput) => {
  try {
    console.log("🟢 createPost called with:", post);

    // Create Supabase client (server-side)
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("❌ Error getting user:", userError.message);
      throw new Error("Failed to get authenticated user");
    }

    if (!user?.id) {
      console.error("⚠️ No authenticated user found");
      throw new Error("User not authenticated");
    }

    console.log("✅ Authenticated user ID:", user.id);

    if (post.image_post_url) {
      const res = await uploadFile({
        file: post.image_post_url,
        folder: `posts/${user.id}`,
      });

      if ("error" in res) {
        throw new Error(res.error);
      }

      const { public_id, secure_url } = res;
      post.cld_id = public_id;
      post.image_post_url = secure_url;
    }

    // Create the post using Prisma
    const newPost = await db.post.create({
      data: {
        title: post.title,
        image_post_url: post.image_post_url,
        post_description: post.post_description ?? null,
        art_type: post.art_type,
        price: post.price ?? null,
        cld_id: post.cld_id ?? null,
        author: {
          connect: { id: user.id },
        },
      },
      include: {
        author: true,
      },
    });

    console.log("✅ Created new post:", newPost);
    return { data: newPost };
  } catch (err) {
    console.error("❌ createPost error:", err);
    throw err; // React Query or Next.js server actions will catch this
  }
};
*/
