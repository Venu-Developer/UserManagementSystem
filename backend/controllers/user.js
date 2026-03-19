import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { calculateAge } from "../utils/calcAge.js";

//  GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

//  UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const data = req.body;

    const updateData = {};

    //  allow only safe fields
    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) updateData.lastName = data.lastName;
    if (data.email) updateData.email = data.email;
    if (data.gender) updateData.gender = data.gender;

    // ✅ DOB → age
    if (data.dob) {
      updateData.dob = data.dob;
      updateData.age = calculateAge(data.dob);
    }

    // ✅ image upload
    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-password");

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

//  CHANGE PASSWORD
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id);

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Old password incorrect" });
  }

  const hash = await bcrypt.hash(newPassword, 10);
  user.password = hash;

  await user.save();

  res.json({ message: "Password updated" });
};

//  DELETE ACCOUNT
export const deleteAccount = async (req, res) => {
  try {
    const { email, dob } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Not found" });

    // email check
    if (user.email !== email) {
      return res.status(400).json({ message: "Email mismatch" });
    }

    // dob check
    const sameDob =
      new Date(user.dob).toISOString().slice(0, 10) ===
      new Date(dob).toISOString().slice(0, 10);

    if (!sameDob) {
      return res.status(400).json({ message: "DOB mismatch" });
    }

    await user.deleteOne();

    res.json({ message: "Account deleted" });

  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};