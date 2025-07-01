import User from "../model/usermodel.js"; // assuming you have this model
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { sendOTP } from "../helper/send.otp.js";

export const loginService = async (userId, password) => {
  try {
    const user = await User.findOne({ userId });
    if (!user) {
      const error = new Error(`User not found`);
      error.statusCode = 400;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error(`Invalid credentials`);
      error.statusCode = 400;
      throw error;
    }
    // Send OTP in the background (non-blocking)
    setImmediate(() => {
      sendOtp(user.userId, user.email, "12", user.role).catch((err) =>
        console.error("OTP send failed:", err)
      );
    });

    return { status: 200, message: "OTP will be sent!", isOTP: true };
  } catch (error) {
    console.error("Login error:", error.message);
    return { status: 400, message: error.message };
  }
};

// OTP Generation Helper
export const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString(); // Generates a 4-digit OTP
};

const sendOtp = async (userId, email, phone, role) => {
  try {
    let otp = generateOTP();

    const obj = {
      subject: "OTP Verification Code",
      html: `<p>Your OTP for login is <b> ${otp} </b>. It is valid for 2 minutes.</p>`,
    };

    // Call sendOtpMail to send the OTP email
    const isMailSent = await sendOTP(email, otp);
    if (isMailSent) {
      // Now, store OTP in the user's document in the database

      const otpExpiry = new Date();
      otpExpiry.setMinutes(otpExpiry.getMinutes() + 2);

      // Find the user and update the OTP and its expiry time
      const user = await User.findOne({ userId });
      if (user) {
        user.otp = { value: otp, expiry: otpExpiry }; // Store OTP and expiry time
        user.isOTP = true; // Store OTP and expiry time

        await user.save(); // Save the updated user document
        console.log("OTP sent and stored in the database");

        return true; // Return true if OTP is successfully sent and stored
      } else {
        console.log("User not found");
        return false; // Return false if user is not found
      }
    }

    // If sending the email failed
    return isMailSent;
  } catch (error) {
    console.error("Error in sending OTP:", error.message);
    return false;
  }
};

export const verifyOtp = async (req, res) => {
 
  try {
    
    console.log(isOTP, "otp record value");
    
    if (typeof userId === "string")
      userId = userId.split(" ").join("").toLowerCase().trim();

    // Find user from database
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }

    // Check if OTP exists and verify expiration
    const otpRecord = user.otp; // Assuming OTP is stored in user record or you can use an OTP collection
    if (!otpRecord) {
      return res.status(403).send({ message: "OTP not found!" });
    }

    // Check if OTP has expired
    const now = new Date();
    if (otpRecord.expiry < now) {
      return res.status(403).send({ message: "OTP has expired!" });
    }

    // Check if the OTP matches
    if (otp !== otpRecord.value) {
      return res.status(403).send({ message: "Invalid OTP!" });
    }
   

    // Clear OTP after successful verification (or mark it as used)
    user.otp = null; // Remove OTP from user record
    await user.save();
    // After OTP is verified, check if the user is an admin or regular user
    if (user.role === 1) {
      const token = jwt.sign(
        { _id: user._id, role: user.role },
        jwtsecret, // Ensure JWT_SECRET is set in your environment
        { expiresIn: "10h" }
      );

      const data = {
        role: user.role,
        _id: user._id,
        userId: user.userId,
        token: token,
      };

      return res.status(200).send({ message: "Verified!", data });
    }

    if (isOTP) {
      const token = jwt.sign(
        { _id: user._id, role: user.role },
        jwtsecret, // Ensure JWT_SECRET is set in your environment
        { expiresIn: "10h" }
      );

      const data = {
        role: user.role,
        _id: user._id,
        userId: user.userId,
        token: token,
      };

      return res.status(200).send({ message: "Verified!", data });
    }

    return res.status(403).send({ message: "Login Failed!" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// In your authRouter file or controller

export const resendOtpEmail = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const sent = await sendOtp(user.userId, user.email, user.phone, user.role);

    if (sent) {
      return res.status(200).json({ message: "OTP resent successfully" });
    } else {
      return res.status(500).json({ message: "Failed to send OTP" });
    }
  } catch (error) {
    console.error("Error in resendOtpEmail:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addUserService = async (req) => {
  try {
    console.log(req, "req in add user service");
    const { name, userId, password } = req;

    if (!name || !userId || !password) {
      const error = new Error("Missing required fields in user data.");
      error.statusCode = 400;
      throw error;
    }
      //  authMiddleware(req, res, response.token); // Assuming authMiddleware sets the token in the response

    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 400;
      throw error;
    }
    req.role = 2;
    req.userId = userId.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);
      const token = jwt.sign(
      {
        data: userId,
      },
      "your",
      { expiresIn: 60 * 60 }
    );
    req.password = hashedPassword;
    //req.token=token
    const user = new User(req);
    user.token=token
     console.log("user token:", token);
     
    const userSaved = await user.save();
    return userSaved;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUsersService = async (role) => {
  try {
    let d = parseInt(role, 10) + 1;
    console.log(d, "ddd");

    const users = await User.find({ role: d });
    return users;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateUserService = async (id, req) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id), // Correctly convert id to ObjectId
      { $set: req }, // Fields to update
      { new: true } // Return the updated user document
    );

    if (!updatedUser) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return updatedUser;
  } catch (error) {
    // Handle error and rethrow with appropriate message
    throw new Error(error.message || "Error updating user");
  }
};

export const changePassword = async (req) => {
  try {
    console.log(req, "rrrr");

    const user = await User.findOne({ userId: req.userId });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    const isMatch = await bcrypt.compare(req.oldPassword, user.password);
    if (!isMatch) {
      const error = new Error(`Enter Correct Password`);
      error.statusCode = 400;
      throw error;
      // throw new Error('Invalid credentials');
    }
    const hashedPassword = await bcrypt.hash(req.newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};
