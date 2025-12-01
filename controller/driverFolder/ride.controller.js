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
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
