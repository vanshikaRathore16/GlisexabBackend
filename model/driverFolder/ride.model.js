import mongoose, { mongo, Schema } from "mongoose";
const rideSchema = new mongoose.Schema(
  {
    rideCode: { type: String, required: true },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
      required: true,
    },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "driver" },
    rideType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ridetype",
      required: true,
    },
    pickUp: { address: String, lat: Number, lng: Number },
    drop: { address: String, lat: Number, lng: Number },
    distanceKm: { type: Number, default: 0 },
    durationMin: { type: Number, default: 0 },
    fare: {
      basePrice: { type: Number, default: 0 },
      distancePrice: { type: Number, default: 0 },
      timePrice: { type: Number, default: 0 },
      surgeMultiplier: { type: Number, default: 1 },
      taxes: { type: Number, default: 0 },
      platformFee: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    // BIDDING SYSTEM (like inDrive)
    customerOfferPrice: { type: Number }, // customer offer
    driverCounterPrice: { type: Number }, // driver offer
    finalAgreedPrice: { type: Number }, // final negotiated price
    otp: { type: String },
    // Ride Timings
    actualStartTime: { type: Date },
    actualEndTime: { type: Date },
    status: {
      type: String,
      enum: [
        "requested", // customer created request
        "offer_sent", // driver offered price
        "accepted", // customer accepted offer
        "arrived", // driver reached pickup
        "ongoing", // ride started
        "completed", // ride completed
        "cancelled", // ride cancelled
      ],
      default: "requested",
    },
    cancelledBy: {
      type: String,
      enum: ["customer", "driver", "system", null],
      default: null,
    },
    cancelReason: { type: String },
    cancelledAt: { type: Date },
    paymentMethod: {
      type: String,
      enum: ["cash", "upi", "wallet"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);
const Ride = mongoose.model("ride", rideSchema);
export default Ride;
