import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./router/userFolder/user.router.js";
dotenv.config();
const app = express();
mongoose.connect(process.env.MONGO_URL)
.then(result=>{
    console.log("Database connected");
    app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use("/user",userRouter);
app.listen(process.env.PORT,()=>{
    console.log("Server started");
})
})
.catch(err=>{
    console.log(err);
    console.log("Database connection failed");
    console.log("database eeror");
})


