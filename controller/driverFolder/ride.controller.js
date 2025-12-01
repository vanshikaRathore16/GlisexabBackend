import Ride from "../../model/driverFolder/ride.model.js";
import Ridetype from "../../model/driverFolder/rideType.model.js";
// to create ride
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
    const rideType = await Ridetype.findById(rideTypeId);
    if (!rideType) return res.status(400).json({ error: "Invalid Ride Type" });
    let fareData = {};
    let finalPrice = null;
    if (!customerOfferPrice) {
      const basePrice = rideType.basePrice;
      const distancePrice = distanceKm * rideType.pricePerKm;
      const timePrice = durationMin * rideType.pricePerMin;
      const subtotal = basePrice + distancePrice + timePrice;
      fareData = {
        basePrice,
        distancePrice,
        timePrice,
        surgeMultiplier: 1,
        taxes: subtotal * 0.05, // example 5% GST
        platformFee: subtotal * 0.1, // 10% company fee
        discount: 0,
        total: subtotal + subtotal * 0.05 + subtotal * 0.1,
      };
      finalPrice = fareData.total;
    }
    const ride = await Ride.create({
      rideCode: "RIDE" + Date.now(),
      customerId,
      rideTypeId,
      pickup,
      drop,
      distanceKm,
      durationMin,
      // Bidding case → store offer price
      customerOfferPrice: customerOfferPrice || null,
      // Non-bidding case → store calculated fare
      fare: fareData,
      finalAgreedPrice: finalPrice,
      status: "requested",
    });

    return res.status(201).json({
      message: "Ride request created successfully",
      ride,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
