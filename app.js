import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./router/userFolder/user.router.js";
import customerRouter from "./router/custometFolder/customer.router.js";
import driverRouter from "./router/driverFolder/driver.router.js";
dotenv.config();
const app = express();
mongoose
  .connect(process.env.MONGO_URL)
  .then((result) => {
    console.log("Database connected");
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    // user router(comman)
    app.use("/user", userRouter);
    // customer router
    app.use("/customer", customerRouter);
    // driver router
    app.use("/driver", driverRouter);
    app.listen(process.env.PORT, () => {
      console.log("Server started");
    });
  })
  .catch((err) => {
    console.log(err);
    console.log("Database connection failed");
    console.log("database eeror");
  });
