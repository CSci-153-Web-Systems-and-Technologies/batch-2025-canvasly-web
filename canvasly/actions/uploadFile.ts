"use server";

import { cld } from "@/lib/cloudinary";

export const uploadFile = async ({
  file,
  folder,
}: {
  file: string;
  folder: string;
}) => {
  try {
    const res = await cld.uploader.upload(file, {
      folder: `canvasly/${folder}`,
      resource_type: "auto",
    });

    console.log("UPLOADFILE.TS File uploaded successfully:", res.secure_url);
    return res;
  } catch (e) {
    console.error("UPLOADFILE.TS Error while uploading:", e);
    return {
      error: "Failed to upload file",
    };
  }
};
