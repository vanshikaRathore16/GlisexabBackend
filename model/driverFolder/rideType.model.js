import mongoose from "mongoose";
const rideTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, default: true },
    seats: { type: Number, default: 1 },
    bagCapacity: { type: Number, default: 0 },
    baseFare: { type: Number, default: 0 },
    perKmRate: { type: Number, default: 0 },
    perMinuteRide: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
const Ridetype = mongoose.model("ridetype", rideTypeSchema);
export default Ridetype;
