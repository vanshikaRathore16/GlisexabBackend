import express from "express";
import { createUser,loginUser,verifyAccount } from "../../controller/userFolder/user.controller.js";

const router = express.Router();
router.post("/signUp",createUser);
router.post("/verification",verifyAccount);
router.post("/logIn",loginUser);
export default router;