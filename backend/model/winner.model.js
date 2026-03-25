const mongoose = require("mongoose");

const winnerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },

  matches: {
    type: Number, 
    required: true
  },

  result: {
    type: String, 
    required: true
  },

  drawNumbers: [Number],

  userScores: [Number],

  prize: {
    type: Number,
    default: 0
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Winner", winnerSchema);