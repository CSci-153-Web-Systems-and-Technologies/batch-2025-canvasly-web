"use server";

import { db } from "@/lib/db";
import { CreateUserInput } from "@/lib/types/supa-base-webhook";
import { deleteFile, uploadFile } from "./uploadFile";
import { createClient } from "@/lib/server";

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

export const getUserById = async (id: string) => {
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

    return { data: user };
  } catch (e) {
    console.log(e);
    return {
      error: "Error fetching user",
    };
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

/*

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
