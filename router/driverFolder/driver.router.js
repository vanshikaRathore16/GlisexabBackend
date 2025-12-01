import express from "express";
import upload from "../../middleware/upload.js";
import {
  addvehicle,
  getDriverFullDetails,
  taggleOnlineStatus,
  uploadDrivingLicense,
  uploadInsurance,
  uploadvehicleRegistration,
} from "../../controller/driverFolder/driver.controller.js";
import {
  createRideType,
  updateRideType,
  deleteRideType,
  getRideTypes,
} from "../../controller/driverFolder/rideType.controller.js";

const router = express.Router();
router.post(
  "/vehicleRegistration/:userId",
  upload.single("vehicleRegistration"),
  uploadvehicleRegistration
);
router.post("/Insurance/:userId", upload.single("Insurance"), uploadInsurance);
router.post(
  "/DrivingLicense/:userId",
  upload.single("DrivingLicense"),
  uploadDrivingLicense
);
router.post("/addVehicle/:userId", upload.array("images", 5), addvehicle);
router.patch("/:userId/toggle-online", taggleOnlineStatus);
router.get("/details/:userId", getDriverFullDetails);

// ----------------------------------------------Ride Type-----------------------------------------//
// Admin routes
router.post("/createRideType", upload.single("image"), createRideType);
router.put("/updateRideType/:id", updateRideType);
router.delete("/deleteRideType/:id", deleteRideType);
// Public
router.get("/getRideType", getRideTypes);
export default router;
