import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ["male","female","other"], default: "other" },
  dob: { type: Date, required: true },
  age: { type: Number },
   profileImage: {
    type: String,
    default: "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
