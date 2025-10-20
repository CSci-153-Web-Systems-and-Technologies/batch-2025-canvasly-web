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

export const deleteFile = async (public_id: string) => {
  try {
    // FIX: Removed the redundant ".v2" from the call.
    // The 'cld' object is the v2 instance, so we access uploader directly.
    const result = await cld.uploader.destroy(public_id);
    console.log("DELETEFILE.TS: Asset deleted successfully:", result);
    return { success: true, result };
  } catch (error) {
    console.error("DELETEFILE.TS: Failed to delete asset:", error);
    // It's often better to throw the error to let the calling function know.
    // However, returning an error object is also a valid pattern.
    return {
      success: false,
      error: "Failed to delete file",
    };
  }
};
