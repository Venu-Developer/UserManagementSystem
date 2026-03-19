import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { calculateAge } from "../utils/calcAge.js";

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, gender, dob } = req.body;

    if (!firstName || !lastName || !email || !password || !dob) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashed,
      gender,
      dob,
      age: calculateAge(dob)
    });

    return res.status(201).json({ id: user._id, email: user.email });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.json({ token });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};
