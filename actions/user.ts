"use server";

import { db } from "@/lib/db";
import { CreateUserInput } from "@/lib/types/supa-base-webhook";
import { deleteFile, uploadFile } from "./uploadFile";
import { createClient } from "@/lib/server";
import { createNotification } from "./notifications"; // import your notifications functions
import { UserType } from "@/types";

export const createUser = async (user: CreateUserInput) => {
  const { id, image_url, username, description, email } = user;

  try {
    const userExists = await db.user.findUnique({
      where: { id },
    });

    if (userExists) {
      updateUser(user);
      return;
    }

    await db.user.create({
      data: {
        id,
        image_url,
        username,
        description,
        email,
      },
    });

    console.log("User created successfully in DB:", email);
  } catch (e) {
    console.log(e);
    return {
      error: "Error creating user",
    };
  }
};

export const updateUser = async (user: CreateUserInput) => {
  const { id, image_url, username, description, email } = user;
  try {
    await db.user.update({
      where: { id },
      data: {
        image_url,
        username,
        description,
        email,
      },
    });

    console.log("User updated successfully in DB:", email);
  } catch (e) {
    console.log(e);
    return {
      error: "Error updating user",
    };
  }
};

export const deleteUser = async (user: { id: string }) => {
  try {
    await db.user.delete({
      where: { id: user.id },
    });

    console.log("User deleted successfully from DB:", user.id);
  } catch (e) {
    console.log(e);
    return {
      error: "Error deleting user",
    };
  }
};

export const getUserById = async (
  id: string
): Promise<{ data?: UserType; error?: string }> => {
  try {
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        image_url: true,
        image_id: true,
        description: true,
        email: true,
      },
    });

    return { data: user ?? undefined };
  } catch (e) {
    console.error(e);
    return { error: "Error fetching user" };
  }
};

export const updateUserProfile = async (params) => {
  const { id, image, prevImageId, description, username } = params;

  try {
    let image_id;
    let image_url;

    // If a new image is provided, upload it and delete the old one.
    if (image) {
      const res = await uploadFile({ file: image, folder: `/users/${id}` });
      // Check for upload error before proceeding
      if (res.error) {
        throw new Error(res.error);
      }

      const { public_id, secure_url } = res;
      image_id = public_id;
      image_url = secure_url;

      // If there was a previous image, delete it from Cloudinary.
      if (prevImageId) {
        await deleteFile(prevImageId);
      }
    }

    // Update the user record in the database.
    await db.user.update({
      where: {
        id,
      },
      data: {
        image_url,
        image_id,
        description,
        username,
      },
    });

    console.log("User profile updated successfully.");
    return { success: true };
  } catch (e) {
    console.error("UPDATE_USER_PROFILE_ERROR:", e);
    // Re-throwing the error so the caller can handle it.
    throw e;
  }
};

export const getAllFollowersAndFollowingsInfo = async (id) => {
  try {
    const followers = await db.follow.findMany({
      where: {
        followingId: id,
      },
      include: {
        follower: true,
      },
    });

    const following = await db.follow.findMany({
      where: {
        followerId: id,
      },
      include: {
        following: true,
      },
    });

    return {
      followers,
      following,
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getArtists = async ({ userAuth }) => {
  try {
    const following = await db.follow.findMany({
      where: {
        followerId: userAuth?.id,
      },
    });

    const followingIds = following.map((f) => f.followingId);

    const suggestions = await db.user.findMany({
      where: {
        AND: [
          { id: { not: userAuth?.id } }, // not current user
          { id: { notIn: followingIds } }, // not someone user follows
          { posts: { some: { image_post_url: { not: "" } } } }, // MUST have at least 1 post
        ],
      },
      select: {
        id: true,
        username: true,
        image_url: true,

        // fetch only the most recent post
        posts: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            image_post_url: true,
            title: true,
            createdAt: true,
          },
        },
      },
    });

    return suggestions;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getFollowSuggestions = async ({ userAuth }) => {
  try {
    const following = await db.follow.findMany({
      where: {
        followerId: userAuth?.id,
      },
    });

    const followingIds = following.map((follow) => follow.followingId);

    const suggestions = await db.user.findMany({
      where: {
        AND: [{ id: { not: userAuth?.id } }, { id: { notIn: followingIds } }],
      },
    });

    return suggestions;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const updateFollow = async (params) => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("NO USER USER.TS ");
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("users")
      .select("username")
      .eq("id", user.id) // Use user.id directly
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError.message);
    }

    const { id, type } = params;

    if (type === "follow") {
      // Create follow record
      await db.follow.create({
        data: {
          follower: {
            connect: { id: user.id },
          },
          following: {
            connect: { id },
          },
        },
      });
      console.log("user followed");

      // Create notification for the user being followed
      await createNotification({
        userId: id, // the user who got followed
        fromUserId: user.id, // the user who followed
        type: "FOLLOW",
        message: `${profileData?.username || "Someone"} started following you!`,
      });
      console.log("Follow notification created");
    } else if (type === "unfollow") {
      await db.follow.deleteMany({
        where: {
          followerId: user.id,
          followingId: id,
        },
      });
      console.log("user unfollowed");

      await db.notification.deleteMany({
        where: {
          userId: id, // Bob (the one being followed/unfollowed)
          fromUserId: user.id, // Alice (the one who followed/unfollowed)
          type: "FOLLOW",
        },
      });

      // await db.notification.deleteMany({ where: { userId: id, fromUserId: user.id, type: "FOLLOW" } })
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};

// ... your other actions like getFollowSuggestions ...

// ADD THIS NEW FUNCTION
export const getFollowInfo = async (userId: string) => {
  if (!userId) {
    return { following: [], followers: [] };
  }

  try {
    // Fetches the list of people the user follows
    const following = await db.follow.findMany({
      where: {
        followerId: userId,
      },
      // Include the profile data of the person being followed
      include: {
        following: true,
      },
    });

    // Fetches the list of people who follow the user
    const followers = await db.follow.findMany({
      where: {
        followingId: userId,
      },
      // Include the profile data of the follower
      include: {
        follower: true,
      },
    });

    return { following, followers };
  } catch (error) {
    console.error("Error fetching follow info:", error);
    return { following: [], followers: [] };
  }
};

export const searchUsers = async (query: string) => {
  try {
    const users = await db.user.findMany({
      where: {
        username: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        username: true,
        image_url: true,
        image_id: true,
        description: true,
      },
      take: 20,
    });

    return { data: users };
  } catch (e) {
    console.log(e);
    return { error: "Error searching users" };
  }
};

/*
export const updateFollow = async (params) => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("NO USER USER.TS ");
      return;
    }

    const { id, type } = params;

    if (type === "follow") {
      await db.follow.create({
        data: {
          follower: {
            connect: {
              id: user?.id,
            },
          },
          following: {
            connect: {
              id,
            },
          },
        },
      });
      console.log("user followed");
    } else if (type === "unfollow") {
      await db.follow.deleteMany({
        where: {
          followerId: user?.id,
          followingId: id,
        },
      });

      console.log("user unfollowed");
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};


export const updateUserProfile = async (params) => {
  const { id, image, prevImageId, description, username } = params;

  try {
    let image_id;
    let image_url;

    if (image) {
      const res = await uploadFile({ file: image, folder: `/users/${id}` });
      const { public_id, secure_url } = res;
      image_id = public_id;
      image_url = secure_url;

      if (prevImageId) {
        await deleteFile(prevImageId);
      }
    }

    await db.user.update({
      where: {
        id,
      },
      data: {
        image_url,
        image_id,
        description,
        username,
      },
    });
    console.log("user image url updated");
  } catch (e) {
    console.log(e);
    throw e;
  }
};


*/
