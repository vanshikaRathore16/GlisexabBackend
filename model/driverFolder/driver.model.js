import mongoose from "mongoose";
const driverSchema = new mongoose.Schema({
    userId:{
    type : mongoose.Schema.Types.ObjectId,
    ref : "user",
    required : true
    },
    isOnline:{type : Boolean,default : false},
    isAvailable:{type : Boolean,default : false},
    isApproved : {type : Boolean,default : false},
    currentLocation:{
        type : {type : String,enum : ["point"],default : "point"},
        coordinates : {type : [Number],default : [0,0]}
    },
    licenseNumber : {type : String},
    totalEarnings : {type : Number,default : 0},
    totalRides : {type : Number,default : 0},
    rating : {type : Number,default : 5.0}
},{timestamps : true});
const Driver = mongoose.model("driver",driverSchema);
export default Driver;