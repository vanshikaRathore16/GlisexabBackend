import express from "express";
import upload from "../../middleware/upload.js";
import {
  addvehicle,
  uploadDrivingLicense,
  uploadInsurance,
  uploadvehicleRegistration,
} from "../../controller/driverFolder/driver.controller.js";
const router = express.Router();
// router.post(
//   "/vehicleRegistration/:userId",
//   (req, res, next) => {
//     console.log("📌 Route reached");
//     next();
//   },
//   upload.single("vehicleRegistration"),
//   uploadvehicleRegistration
// );
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
router.post("/addVehicle", upload.array("images", 5), addvehicle);
export default router;
