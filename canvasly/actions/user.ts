"use server";

import { db } from "@/lib/db";
import { CreateUserInput } from "@/lib/types/supa-base-webhook";

export const createUser = async (user: CreateUserInput) => {
  const { id, image_url, username, description, email_address } = user;

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
        email_address,
      },
    });

    console.log("User created successfully in DB:", email_address);
  } catch (e) {
    console.log(e);
    return {
      error: "Error creating user",
    };
  }
};

export const updateUser = async (user: CreateUserInput) => {
  const { id, image_url, username, description, email_address } = user;
  try {
    await db.user.update({
      where: { id },
      data: {
        image_url,
        username,
        description,
        email_address,
      },
    });

    console.log("User updated successfully in DB:", email_address);
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
        description: true,
        email_address: true,
      },
    });
  } catch (e) {
    console.log(e);
    return {
      error: "Error fetching user",
    };
  }
};
