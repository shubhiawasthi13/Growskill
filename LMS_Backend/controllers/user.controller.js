import { User } from "../modal/user.modal.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import fs from "fs/promises";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "user already exist.",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashPassword,
    });
    return res.status(201).json({
      success: true,
      message: "Account Created Sucessfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "failed to register.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "incorrect email or password",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "incorrect email or password",
      });
    }
    generateToken(res, user, `Welcome back ${user.name}`);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "failed to login.",
    });
  }
};

export const logOut = async (_, res) => {
  try {
    return res
      .clearCookie("token", {
        httpOnly: true,
        secure: true,         // ✅ Required for HTTPS (Render)
        sameSite: "None",     // ✅ Required for cross-site cookie removal
      })
      .status(200)
      .json({
        success: true,
        message: "Logged out successfully.",
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in logout.",
    });
  }
};


export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select("-password").populate("enrollCourses");
    if (!user) {
      return res.status(500).json({
        success: false,
        message: "profile not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error in getting profile",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { name } = req.body;
    const profilePhoto = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 👇 Step 2: Delete old image from Cloudinary
    if (user.photoUrl) {
      const publicId = user.photoUrl.split("/").pop().split(".")[0];
      await deleteMediaFromCloudinary(publicId);
    }

    // 👇 Step 3: Upload new image to Cloudinary
    const cloudResponse = await uploadMedia(profilePhoto.path);
    const photoUrl = cloudResponse.secure_url;

    // 👇 Step 4: Delete local file from 'uploads/' folder
    await fs.unlink(profilePhoto.path);

    // 👇 Step 5: Update user in DB
    const updateData = { name, photoUrl };
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    return res.status(201).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};
