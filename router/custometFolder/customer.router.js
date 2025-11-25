import express from "express";
import { getCustometProfile, updateCustomerProfile } from "../../controller/custometFolder/customer.controller.js";
import upload from "../../middleware/upload.js";
const router = express.Router();
router.get("/profile/:userId",getCustometProfile);
router.put("/profileUpdate/:userId",upload.single("image"),updateCustomerProfile);
export default router;
