import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config(); // Ensure env vars are loaded before config

if (!process.env.CLOUDINARY_NAME) {
  console.warn("WARNING: Cloudinary environment variables are not set. Check your .env file.");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;
