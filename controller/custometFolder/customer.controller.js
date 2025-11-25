import { request, response } from "express";
import Customer from "../../model/customerFolder/customer.model.js";
import User from "../../model/userFolder/user.model.js";
export const getCustometProfile = async (request, response, next) => {
  try {
    const  {userId} = request.params;
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

// export const updateCustomerProfile = async (request, response, next) => {
//   try {
//     const {userId} = request.params;
//     const updatedCustomer = await Customer.updateOne(
//       { userId },
//       { $set: request.body },
//       { upsert: true }
//     );
//     return response.status(200).json({ msg: "Profile updated successfully" });
//   } catch (err) {
//     console.log(err);
//     return response.status(500).json({ err: "Internal server error" });
//   }
// };

export const updateCustomerProfile = async(request,response,next)=>{
  try{
    const {userId} = request.params;
    const user = await User.findById(userId);
    if(!user)
      return response.status(404).json({msg : "User not found"});
    const customer = await Customer.findOne({userId});
    if(!customer)
      return response.status(404).json({msg : "Customer not found"});
    if(request.body.name) user.name = request.body.name;
    if(request.body.email) user.email = request.body.email;
    if(request.body.contact) user.constact = request.body.contact;
    if(request.file)
      user.image = request.file.path;
    await user.save();
    if(request.body.title || request.body.address || request.body.lat || request.body.lng){
      customer.savedAddress=[
        {
          title : request.body.title,
          address : request.body.address,
          lat : request.body.lat,
          lng : request.body.lng
        }
      ]
    }
    await customer.save();
    return response.status(200).json({success : true,msg : "Profile updated successfully"});
  }catch(err){
    console.log(err);
    return response.status(500).json({err : "Internal server error"});
  }
}
