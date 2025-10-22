"use server";

import { db } from "@/lib/db";
import { CreateUserInput } from "@/lib/types/supa-base-webhook";
import { deleteFile, uploadFile } from "./uploadFile";

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
