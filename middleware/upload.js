import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
console.log("🔥 Multer middleware loaded");
const storage = new CloudinaryStorage({
  cloudinary,
  params: async(req, file) => {
    console.log("🔥 In storage params — about to upload to Cloudinary");
    console.log("🔥 File in params:", file);
    console.log("🔥 Checking Cloudinary connection…");
  console.log("🔥 CLOUD NAME:", cloudinary.config().cloud_name);
  console.log("🔥 API KEY:", cloudinary.config().api_key);
  console.log("🔥 API SECRET:", cloudinary.config().api_secret ? "Loaded" : "Missing");
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
