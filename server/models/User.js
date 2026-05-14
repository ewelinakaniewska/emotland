import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: false },
  name: { type: String },
  email: { type: String, unique: true, sparse: true },
  age: { type: Date },
  password: { type: String, required: true },
  points: { type: Number },
  newsletter: { type: Boolean },
  parent: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  child: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  role: { type: String, enum: ["parent", "therapist", "child"] },
  code: { type: String },
  refreshToken: {
    type: String,
    unique: true,
    sparse: true,
  },
  isVerified: { type: Boolean, default: false },
  verificationToken: {type: String},
  resetPasswordToken: {type: String},
  resetPasswordExpires: {type: Date}

}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
