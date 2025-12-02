import { request, response } from "express";
import Ride from "../../model/driverFolder/ride.model.js";
import Ridetype from "../../model/driverFolder/rideType.model.js";
import Driver from "../../model/driverFolder/driver.model.js";
import Vehicle from "../../model/driverFolder/vehicle.model.js";
// import Ride from "../../model/driverFolder/ride.model.js";
import { nanoid } from "nanoid";

// To create ride
export const createRide = async (req, res) => {
  try {
    const {
      customerId,
      rideTypeId,
      pickup,
      drop,
      distanceKm,
      durationMin,
      customerOfferPrice,
    } = req.body;

    // Fetch Ride Type
    const rideType = await Ridetype.findById(rideTypeId);
    if (!rideType) return res.status(400).json({ error: "Invalid Ride Type" });

    // ❗ Validate ride type pricing fields
    if (
      rideType.baseFare === undefined ||
      rideType.perKmRate === undefined ||
      rideType.perMinuteRide === undefined
    ) {
      return res.status(400).json({
        error: "RideType pricing fields are missing",
      });
    }

    // ❗ Validate request numbers
    if (distanceKm === undefined || durationMin === undefined) {
      return res.status(400).json({
        error: "distanceKm and durationMin are required",
      });
    }

    let fareData = {};
    let finalPrice = null;

    // ⭐ If customer did NOT give offer price → calculate fare
    if (!customerOfferPrice) {
      const basePrice = rideType.baseFare;
      const distancePrice = distanceKm * rideType.perKmRate;
      const timePrice = durationMin * rideType.perMinuteRide;

      const subtotal = basePrice + distancePrice + timePrice;

      // If any calculation becomes NaN → stop right here
      if (
        isNaN(basePrice) ||
        isNaN(distancePrice) ||
        isNaN(timePrice) ||
        isNaN(subtotal)
      ) {
        return res.status(400).json({
          error: "Invalid pricing values — calculation failed",
        });
      }

      fareData = {
        basePrice,
        distancePrice,
        timePrice,
        surgeMultiplier: 1,
        taxes: subtotal * 0.05,
        platformFee: subtotal * 0.1,
        discount: 0,
        total: subtotal + subtotal * 0.05 + subtotal * 0.1,
      };

      finalPrice = fareData.total;
    }

    // Create Ride
    const ride = await Ride.create({
      rideCode: "RIDE-" + nanoid(10),
      customerId,
      rideType: rideTypeId,
      pickup,
      drop,
      distanceKm,
      durationMin,
      customerOfferPrice: customerOfferPrice || null,
      fare: fareData,
      finalAgreedPrice: finalPrice,
      status: "requested",
    });

    return res.status(201).json({
      message: "Ride request created successfully",
      ride,
    });
  } catch (err) {
    console.log("❌ ERROR:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// only online and type of vehicle ,ist be same as driver vehicle(so driver get request)
export const getRideRequestsForDriver = async (req, res, next) => {
  try {
    const { driverId } = req.query;

    if (!driverId)
      return res.status(400).json({ error: "driverId is required" });
    console.log("DriverId:", driverId);
    // 1️⃣ Find driver using userId
    const driver = await Driver.findOne({ userId: driverId });
    if (!driver) {
      console.log("❌ Driver not found for userId:", driverId);
      return res.status(404).json({ error: "Driver not found" });
    }
    // 2️⃣ Check if driver is online
    if (!driver.isOnline) {
      return res.status(403).json({
        error: "Driver must be ONLINE to receive ride requests",
      });
    }
    // 3️⃣ Find driver's vehicle
    const vehicle = await Vehicle.findOne({ driverId: driver._id });
    if (!vehicle) {
      console.log("❌ Vehicle not found for driver:", driver._id);
      return res.status(400).json({ error: "Driver vehicle not found" });
    }
    // 4️⃣ Find RideType using vehicle type
    const rideType = await Ridetype.findOne({
      name: { $regex: new RegExp(`^${vehicle.type}$`, "i") },
    });
    if (!rideType) {
      console.log("❌ RideType not found for vehicle.type:", vehicle.type);
      return res.status(400).json({
        error: `No RideType found for vehicle type '${vehicle.type}'`,
      });
    }

    // 5️⃣ Get ride requests
    const rides = await Ride.find({
      status: "requested",
      rideType: rideType._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Ride requests fetched successfully",
      rides,
    });
  } catch (err) {
    console.log("🔥 ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
