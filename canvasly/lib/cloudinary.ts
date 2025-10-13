import { v2 as cloudinary, ConfigOptions } from "cloudinary";

// Create a type for the cloudinary instance
type CloudinaryType = typeof cloudinary;

declare global {
  var cloudinaryInstance: CloudinaryType | undefined;
}

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Cloudinary environment variables are not set!");
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use cached instance in dev
export const cld = globalThis.cloudinaryInstance || cloudinary;

if (process.env.NODE_ENV !== "production") globalThis.cloudinaryInstance = cld;
