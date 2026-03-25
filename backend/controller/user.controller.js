const userModel = require("../model/user.model");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();

    res.json({ users });

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};