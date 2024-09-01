const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  responses: [{ question: String, answer: String }],
  feedbackType: { type: String, enum: ["text", "video"], required: true },
  video: { type: String },
  submittedAt: { type: Date, default: Date.now },
});


const spaceSchema = new mongoose.Schema(
  {
    spacename: { type: String, required: true },
    publicUrl: { type: String, required: true, unique: true },
    headerTitle: { type: String },
    customMessage: { type: String },
    questions: [{ type: String }],
    starRatings: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    user_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    feedback: [feedbackSchema],
    links: [{ type: String }],
    img: { type: String },
  },
  { versionKey: false }
);

const Space = mongoose.model("Space", spaceSchema);
module.exports = { Space };