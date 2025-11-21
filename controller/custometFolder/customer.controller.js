import { request, response } from "express";
import Customer from "../../model/customerFolder/customer.model.js";
export const getCustometProfile = async (request, response, next) => {
  try {
    const userId = request.params.userId;
    const customer = await Customer.findOne({ userId }).populate(
      "usreId",
      "name email constact"
    );
    if (!customer)
      return response.status(400).json({ msg: "Customer not found" });
    return response.status(200).json({ customer: customer });
  } catch (err) {
    console.log(err);
    return response.status(500).json({ err: "Internal server error" });
  }
};

export const updateCustomerProfile = async (request, response, next) => {
  try {
    const userId = request.params.userId;
    const updatedCustomer = await Customer.updateOne(
      { userId },
      { $set: request.body },
      { upsert: true }
    );
    return response.status(200).json({ msg: "Profile updated successfully" });
  } catch (err) {
    console.log(err);
    return response.status(500).json({ err: "Internal server error" });
  }
};
