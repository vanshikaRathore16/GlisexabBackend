import express from "express";
import {
  changePassword,
  createUser,
  deleteUser,
  getUserDetails,
  loginUser,
  verifyAccount,
} from "../../controller/userFolder/user.controller.js";

const router = express.Router();
router.post("/signUp", createUser);
router.post("/verification", verifyAccount);
router.post("/logIn", loginUser);
router.get("/getAllUserInfo", getUserDetails);
router.patch("/updatePasswordChange/:userId", changePassword);
router.delete("/deleteUser/:userId", deleteUser);
export default router;
