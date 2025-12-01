import { request, response } from "express";
import User from "../../model/userFolder/user.model.js";
import bcrypt, { compare } from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
// To signUp user
export const createUser = async (request, response, next) => {
  try {
    let { name, email, contact, password, role } = request.body;
    console.log("password", password);
    const exitUser = await User.findOne({ email });
    if (exitUser)
      return response.status(400).json({ err: "Email already register" });
    const salt = await bcrypt.genSalt(12);
    password = await bcrypt.hash(password, salt);
    let user = await User.create({ name, email, password, contact, role });
    sendEmail(email, name);
    return response.status(201).json({
      msg: "User created successFully! Check your mail for verify email",
    });
  } catch (err) {
    console.log(err);
    return response.status(500).json({ err: "Internal server error" });
  }
};

// To logIn
export const loginUser = async (request, response, next) => {
  try {
    let { email, password } = request.body;
    let user = await User.findOne({ email });
    if (!user)
      return response.status(401).json({ err: "Invalid email or password" });
    if (!user.isVerified)
      return response
        .status(401)
        .json({ err: "Please verify your email first" });
    let status = await bcrypt.compare(password, user.password);
    if (!status)
      return response.status(401).json({ err: "Invalid email or password" });
    user.password = undefined;
    return response.status(200).json({ msg: "Sign in success", user });
  } catch (err) {
    console.log(err);
    return response.status(500).json({ err: "Internal server error" });
  }
};

// To verify account
export const verifyAccount = async (request, response, next) => {
  try {
    const { email } = request.body;
    if (!email) return response.status(400).json({ msg: "email is required" });
    let result = await User.updateOne(
      { email },
      { $set: { isVerified: true } }
    );
    return response
      .status(200)
      .json({ msg: "Account Verified Successfully! You can now login" });
  } catch (err) {
    console.log(err);
    return response.status(500).json({ err: "Internal server error" });
  }
};
// TO change password
export const changePassword = async (request, response, next) => {
  try {
    const { userId } = request.params;
    const { oldPassword, newPassword } = request.body;
    if (!oldPassword || !newPassword)
      return response.status(400).json({ msg: "Both are required" });
    const user = await User.findById(userId);
    if (!user) return response.status(404).json({ msg: "user not found" });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return response.status(401).json({ err: "Old password is incorrect" });
    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(newPassword, salt);
    user.password = hashed;
    await user.save();
    return response
      .status(200)
      .json({ success: true, msg: "password changed successfullt" });
  } catch (err) {
    console.log(err);
    return response.status(500).json({ err: "Internal server error" });
  }
};
// ------------------------------------------------------------------------------------------------------
// to get all user detail(just for developer use);
export const getUserDetails = async (request, response, next) => {
  try {
    const userList = await User.find();
    return response.status(200).json({ msg: userList });
  } catch (err) {
    console.log(err);
  }
};
// To send mail in email
const sendEmail = (email, name) => {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Account Verification",
      html: `
                <div style="font-family: Arial; background: #f8f9fa; padding: 20px;">
                    <h2 style="color: #007bff;">Welcome ${name}! 🚀</h2>
                    <p>Thank you for joining our Taxi App.</p>
                    <p>Please verify your email to activate your account:</p>
                    <form method="post" action="http://localhost:3000/user/verification">
                        <input type="hidden" name="email" value="${email}"/>
                        <button type="submit" style="background:#007bff; color:white; padding:15px 30px; border:none; border-radius:8px; font-size:16px; cursor:pointer;">
                            ✅ Verify My Account
                        </button>
                    </form>
                    <p style="margin-top:20px; color:gray;">Or click here: <a href="http://localhost:3000/user/verification" style="color:#007bff;">Verify Now</a></p>
                    <br>
                    <small>Team Taxi App</small>
                </div>
            `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};
