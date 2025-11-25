import express from "express";
import { getCustomerDetails, getCustometProfile, updateCustomerProfile } from "../../controller/custometFolder/customer.controller.js";
import upload from "../../middleware/upload.js";
const router = express.Router();
router.get("/profile/:userId",getCustometProfile);
router.put("/profileUpdate/:userId",upload.single("image"),updateCustomerProfile);
router.get("/getFullProfile/:userId",getCustomerDetails);
export default router;
