import multer from "multer";
import pkg from "multer-storage-cloudinary";
import cloudinary from "../services/cloudinary.js";

const StorageExport = pkg.CloudinaryStorage ?? pkg.default ?? pkg;

const storageOptions = {
  cloudinary,
  params: {
    folder: "ticket-system",
    allowed_formats: ["jpg", "png", "jpeg"], // Only images
  },
};

let storage;
if (typeof StorageExport === "function") {
  try {
    storage = new StorageExport(storageOptions);
  } catch (err) {
    storage = StorageExport(storageOptions);
  }
} else {
  throw new Error("Unsupported export from multer-storage-cloudinary: expected a constructor or factory function");
}

export const uploadImages = multer({ storage }).array("images", 5);
