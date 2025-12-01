import express from "express";
import {
  createRideType,
  updateRideType,
  deleteRideType,
  getRideTypes,
} from "../../controller/driverFolder/rideType.controller.js";
import upload from "../../middleware/upload.js";
const router = express.Router();

// Admin routes
router.post("/createRideType", upload.single("image"), createRideType);
router.put("/updateRideType/:id", updateRideType);
router.delete("/deleteRideType/:id", deleteRideType);

// Public
router.get("/getRideType", getRideTypes);

export default router;
