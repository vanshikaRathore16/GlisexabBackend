import mongoose from "mongoose";
const vehicleSchema = new mongoose.Schema({
    driverId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "driver",
        required : true
    },
    type : {type : String,enum : ["bike","tricycle","auto","sedan","suv"],required : true},
    brand : {type : String,required : true},
    model : {type : String,required : true},
    color : {type : String,required : true},
    plateNumber : {type : String,required : true,unique : true},
    seats:{type : Number,required : true},
    bags : {type : Number,default : 0},
    year : {type : Number},
    image : {type : String},//vehicle photo
    isActive : {type : Boolean,default : true}
},{timestamps : true})
const Vehicle = mongoose.model("vehicle",vehicleSchema);
export default Vehicle;