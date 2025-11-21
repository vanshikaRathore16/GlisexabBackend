import express from "express";
import { getCustometProfile, updateCustomerProfile } from "../../controller/custometFolder/customer.controller.js";
const router = express.Router();
router.get("/profile/:userId",getCustometProfile);
router.put("/profileUpdate/:userId",updateCustomerProfile);
export default router;
