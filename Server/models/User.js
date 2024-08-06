const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true, required: true }, // Unique and required
    phoneNum: { type: Number, required: true }, // Not unique
    password: { type: String, required: true }, // Required
  },
  { versionKey: false }
);

const Users = mongoose.model("User", UserSchema); // Ensure the model name starts with an uppercase letter
module.exports = { Users };
