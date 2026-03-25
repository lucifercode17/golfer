const mongoose = require("mongoose");

const charitySchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String
});

module.exports = mongoose.model("Charity", charitySchema);