const Charity = require("../model/charity.model");

exports.getCharities = async (req, res) => {
  const charities = await Charity.find();
  res.json({ charities });
};