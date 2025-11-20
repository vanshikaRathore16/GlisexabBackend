import express from "express";
import { createUser,getUserDetails,loginUser,verifyAccount } from "../../controller/userFolder/user.controller.js";

const router = express.Router();
router.post("/signUp",createUser);
router.post("/verification",verifyAccount);
router.post("/logIn",loginUser);
router.get("/getAllUserInfo",getUserDetails);
export default router;