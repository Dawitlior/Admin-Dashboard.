import mongoose from "mongoose";
import User from "../models/User.js";

export const getAdmins = async (request, response) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    response.status(200).json(admins);
  } catch (error) {
    response.status(404).json({ message: error.message });
  }
};
