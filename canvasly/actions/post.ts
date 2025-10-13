"use server";

import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { uploadFile } from "./uploadFile";
import { PostInput } from "@/lib/constants";

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
    /*
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
*/
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

    console.log("✅ Prisma created new post:", newPost);
    return { data: newPost };
  } catch (err) {
    console.error("❌ createPost error:", err);
    throw err;
  }
};

export const getMyFeedPosts = async (lastCursor) => {
  try {
    const take = 5;
    const posts = await db.post.findMany({
      include: {
        author: true,
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
