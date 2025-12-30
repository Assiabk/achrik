// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ["investor", "projectOwner"], required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
