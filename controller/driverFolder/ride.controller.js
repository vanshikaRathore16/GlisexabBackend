import { request, response } from "express";
import Ride from "../../model/driverFolder/ride.model.js";
import Ridetype from "../../model/driverFolder/rideType.model.js";
import Driver from "../../model/driverFolder/driver.model.js";
import Vehicle from "../../model/driverFolder/vehicle.model.js";
// import Ride from "../../model/driverFolder/ride.model.js";
import { nanoid } from "nanoid";
//  to get all rides
export const getAllRide = async (request, response, next) => {
  try {
    let rideList = await Ride.find();
    return response.status(200).json({ list: rideList });
  } catch (err) {
    console.log(err);
    return response.status(500).json({ err: "Internal server error" });
  }
};
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

// driver counter price
export const driverBargain = async (req, res) => {
  try {
    const { rideId, driverId, driverCounterPrice } = req.body;
    if (!rideId || !driverId || !driverCounterPrice) {
      return res.status(400).json({
        error: "rideId, driverId, and driverCounterPrice are required",
      });
    }
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }
    if (ride.status !== "requested") {
      return res.status(400).json({
        error: "Driver cannot send offer now, ride is no longer available",
      });
    }
    const updatedRide = await Ride.findByIdAndUpdate(
      rideId,
      {
        $set: {
          driverId: driverId,
          driverCounterPrice: driverCounterPrice,
          status: "offer_sent",
        },
      },
      { new: true }
    );
    return res.status(200).json({
      message: "Driver offer sent successfully",
      ride: updatedRide,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// customer accept the offer
export const customerRespondToDriverOffer = async (req, res) => {
  try {
    const { rideId, customerId, acceptedPrice, reject } = req.body;
    if (!rideId || !customerId) {
      return res.status(400).json({
        error: "rideId and customerId are required",
      });
    }
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ error: "Ride not found" });
    console.log("ride customer id", ride.customerId.toString());
    console.log("customer id", customerId);
    if (ride.customerId.toString() !== customerId) {
      return res.status(403).json({ error: "Not authorized" });
    }
    if (ride.status !== "offer_sent") {
      return res.status(400).json({
        error: "Ride is not in offer stage",
      });
    }
    // 1. CUSTOMER REJECTS OFFER
    if (reject === true) {
      ride.driverCounterPrice = null;
      ride.status = "requested"; // back to ride pool (like inDrive)
      await ride.save();
      return res.status(200).json({
        message: "Offer rejected. Searching for new drivers...",
        ride,
      });
    }
    // ✅ 2. CUSTOMER ACCEPTS OFFER
    if (acceptedPrice) {
      ride.finalAgreedPrice = acceptedPrice;
      ride.status = "accepted";
      await ride.save();
      return res.status(200).json({
        message: "Offer accepted successfully",
        ride,
      });
    }
    return res.status(400).json({
      error: "Send either acceptedPrice or reject: true",
    });
  } catch (err) {
    console.log("🔥 ERROR:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// now driver accept ride
export const driverAcceptRide = async (req, res, next) => {
  try {
    const { rideId, driverId } = req.body;
    if (!rideId || !driverId)
      return res
        .status(400)
        .json({ error: "rideId and driverId are required" });
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ error: "Ride not found" });
    // Ride must be accepted by customer
    if (!["requested", "accepted"].includes(ride.status)) {
      return res.status(400).json({
        error: `Ride cannot be accepted in current status: ${ride.status}`,
      });
    }
    ride.driverId = driverId;
    ride.otp = Math.floor(1000 + Math.random() * 9000).toString();
    ride.status = "arrived";
    await ride.save();
    return res.status(200).json({
      message: "Ride accepted by driver",
      otp: ride.otp,
      ride,
    });
  } catch (err) {
    console.log(err);
    return response.status(500).json({ err: "Internal server error" });
  }
};
