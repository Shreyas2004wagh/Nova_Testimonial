const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true, required: true }, // Unique and required
    phoneNum: { type: Number, required: true }, // Not unique
    password: { type: String, required: true },
    otp: { type: String }, // Store OTP
    otpExpiration: { type: Date }, // Store OTP expiration
  },
  { versionKey: false }
);

const Users = mongoose.model("User", UserSchema);
module.exports = { Users };