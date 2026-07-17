import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";


const storage =new CloudinaryStorage({
  cloudinary,
params: {
folder:"ticket-system",
allowed_formats: ["jpg","png","jpeg"],// Only images
  },
});

export const uploadImages = multer({ storage }).array("images", 5);
