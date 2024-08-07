const mongoose = require("mongoose");

const spaceSchema = new mongoose.Schema(
  {
    spacename: { type: String, required: true },
    publicUrl: { type: String, required: true, unique: true },
    headerTitle: { type: String },
    customMessage: { type: String },
    questions: [{ type: String }],
    starRatings: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const Space = mongoose.model("Space", spaceSchema);
module.exports = { Space };