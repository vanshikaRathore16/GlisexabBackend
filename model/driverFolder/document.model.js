import mongoose from "mongoose";
const documentSchema = new mongoose.Schema({
    driverId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "driver",
        required : true
    },
    type : {
        type : String,
        enum : ["profile_photo","driving_license","vahicle_registration","insurance","pan_card"],
        required : true
    },
    imageName : {type : String,required : true},
    status : {type : String,enum : ["pending","approved","rejected"],default : "pending"},
    uploadAt : {type : Date,default : Date.now}
},{timestamps : true});
const Document = mongoose.model("document",documentSchema);
export default Document;