import mongoose, { mongo } from "mongoose";
const custometSchema = new mongoose.Schema({
    userId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true,
        unique : true
    },
    savedAddress:[{
        title : String,
        address : String,
        lat : Number,
        lng : Number
    }],
    emergencyContacts:[{
        name : String,
        phone : String
    }],
    totalRides:{type : Number,default : 0},
    rating : {type : Number,default : 5.0}
},{timestamps : true});
const Customer = mongoose.model("customer",custometSchema);
export default Customer;