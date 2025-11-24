import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
console.log("🔥 Multer middleware loaded");
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    console.log("🔥 In storage params — about to upload to Cloudinary");
    console.log("🔥 File in params:", file);
    return {
      folder: "vehicle_doc",
      resource_type: "auto",
      allowed_formats: ["jpg", "jpeg", "png"],
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});
const upload = multer({ storage });
export default upload;
