import Ridetype from "../../model/driverFolder/rideType.model.js";
// create ride type
export const createRideType = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.image = req.file.path;
      data.imageId = req.file.filename;
    }
    const rideType = await Ridetype.create(data);
    return res.status(201).json({
      message: "Ride type created successfully",
      rideType,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
// update ride type
export const updateRideType = async (request, response) => {
  try {
    const { id } = request.params;

    await Ridetype.findByIdAndUpdate(id, request.body);

    return response.status(200).json({ message: "Ride type updated" });
  } catch (err) {
    console.log(err);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};
// delete ride type
export const deleteRideType = async (request, response) => {
  try {
    await Ridetype.findByIdAndDelete(request.params.id);
    return response.status(200).json({ message: "Ride type deleted" });
  } catch (err) {
    console.log(err);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};
// to get ride type all details
export const getRideTypes = async (request, response) => {
  try {
    const rideTypes = await Ridetype.find({ isActive: true });
    return response.status(200).json(rideTypes);
  } catch (err) {
    console.log(err);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};
