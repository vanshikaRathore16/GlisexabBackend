import { request, response } from "express";
import Driver from "../../model/driverFolder/driver.model.js";
import Vehicle from "../../model/driverFolder/vehicle.model.js";
import Document from "../../model/driverFolder/document.model.js";
// export const uploadvehicleRegistration = async (request, response, next) => {
//   try {
//     const { userId } = request.params;
//     const driver = await Driver.findOne({ userId });
//     if (!driver) return response.status(400).json({ msg: "Driver not found" });
//     console.log("FILE:", request.file);
//     console.log("BODY:", request.body);
//     const document = await Document.findOneAndUpdate(
//       { driverId: driver._id, type: "vahicle_registration" },
//       {
//         driverId: driver._id,
//         type: "vahicle_registration",
//         imageName: request.file.path ?? request.file.url,
//         status: "pending",
//       },
//       { upsert: true }
//     );
//     console.log("after document");
//     return response
//       .status(200)
//       .json({ success: true, msg: "vahicle_registration uploaded" });
//   } catch (err) {
//     console.log(err);
//     return response.status(500).json({ err: "Internal server error" });
//   }
// };

export const uploadvehicleRegistration = async (request, response, next) => {
  console.log("🔥 Controller ENTERED");

  try {
    console.log("➡ userId:", request.params.userId);

    const { userId } = request.params;

    console.log("🔥 Before Driver.findOne()");
    const driver = await Driver.findOne({ userId });
    console.log("🔥 After Driver.findOne()", driver);

    if (!driver) {
      console.log("❌ Driver not found");
      return response.status(400).json({ msg: "Driver not found" });
    }

    console.log("🔥 FILE object:", request.file?.url);
    console.log("🔥 BODY object:", request.file?.secure_url);

    console.log("🔥 Before Document.findOneAndUpdate()");
    const document = await Document.findOneAndUpdate(
      { driverId: driver._id, type: "vahicle_registration" },
      {
        driverId: driver._id,
        type: "vahicle_registration",
        imageName: request.file?.url || request.file?.secure_url,
        status: "pending",
      },
      { upsert: true, new: true }
    );
    console.log("🔥 After Document.findOneAndUpdate()", document);

    console.log("🔥 Sending response...");
    return response.status(200).json({
      success: true,
      msg: "vahicle_registration uploaded",
    });
  } catch (err) {
    console.log("🔥 ERROR in controller:", err);
    return response.status(500).json({ err: "Internal server error" });
  }
};

export const uploadInsurance = async (request, response, next) => {
  try {
    const { userId } = request.params;
    const driver = await Driver.findOne({ userId });
    if (!driver) return response.status(400).json({ msg: "Driver not found" });
    const document = await Document.findOneAndUpdate(
      { driverId: driver._id, type: "insurance" },
      {
        driverId: driver._id,
        type: "insurance",
        imageName: request.file.path,
        status: "pending",
      },
      { upsert: true }
    );
    return response
      .status(200)
      .json({ success: true, msg: "insurance uploaded" });
  } catch (err) {
    console.log(err);
    return response.status(500).json({ err: "Internal server error" });
  }
};

export const uploadDrivingLicense = async (request, response, next) => {
  try {
    const { userId } = request.params;
    const driver = await Driver.findOne({ userId });
    if (!driver) return response.status(400).json({ msg: "Driver not found" });
    const document = await Document.findOneAndUpdate(
      { driverId: driver._id, type: "driving_license" },
      {
        driverId: driver._id,
        type: "driving_license",
        imageName: request.file.path,
        status: "pending",
      },
      { upsert: true }
    );
    return response
      .status(200)
      .json({ success: true, msg: "driving_license uploaded" });
  } catch (err) {
    console.log(err);
    return response.status(500).json({ err: "Internal server error" });
  }
};

export const addvehicle = async (request, response, next) => {
  try {
    const { userId } = request.params;
    const driver = await Driver.findOne({ userId });
    if (!driver) return response.status(400).json({ msg: "Driver not found" });
    const images = request.file ? request.file.map((f) => f.path) : [];
    const vehicle = await Vehicle.findOneAndUpdate(
      { driverId: driver._id },
      {
        driverId: driver._id,
        type: request.body.type,
        brand: request.body.brand,
        model: request.body.model,
        color: request.body.color,
        plateNumber: request.body.plateNumber,
        seats: request.body.seats,
        bags: request.body.bags || 0,
        year: request.body.year,
        image: images[0] || "",
        isActive: true,
      },
      { upsert: true }
    );
    return response
      .status(200)
      .json({ success: true, msg: "Vehicle added successfully" });
  } catch (err) {
    console.log(err);
    return response.status(500).json({ err: "Internal server error" });
  }
};
