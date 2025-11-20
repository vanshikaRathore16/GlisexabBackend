import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name : {type :String, required : true},
    email : {type : String,required : true,unique : true},
    password : {type : String, required : true},
    constact : {type : String},
    isVerified : {type : Boolean,default : true},
    role : {type : String, enum : ["customer","driver"],default : "customer"},
    image : {type : String},
},{timestamps : true})
const User = mongoose.model("user",userSchema);
export default User;