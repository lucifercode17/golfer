const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../model/blacklist.model");
const mongoose = require("mongoose");
const Winner = require("../model/winner.model");

// ================= REGISTER =================
exports.postRegister = async (req, res) => {
  try {
    const { email, password, name, charity } = req.body;

    const isExits = await userModel.findOne({ email });

    if (isExits) {
      return res.status(422).json({
        message: "User already exists"
      });
    }

    let charityId = null;

    if (charity && mongoose.Types.ObjectId.isValid(charity)) {
      charityId = charity;
    }

    const user = await userModel.create({
      email,
      password,
      name,
      charity: charityId
    });

    res.status(201).json({
      message: "Registered successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
};

// ================= LOGIN =================
exports.postlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Email or password is invalid"
      });
    }

    const isValidPassword = await user.comparepassword(password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Email or password is invalid"
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    // ✅ FIXED COOKIE (PRODUCTION READY)
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,        // required for HTTPS (Render/Vercel)
      sameSite: "None",    // required for cross-origin
    });

    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin
      },
      token
    });

  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

// ================= LOGOUT =================
exports.userlogoutcontroller = async (req, res) => {
  try {
    const token =
      req.cookies.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(200).json({
        message: "User already logged out"
      });
    }

    // ✅ FIXED COOKIE CLEAR
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    await tokenBlackListModel.create({ token });

    return res.status(200).json({
      message: "User logged out successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
};

// ================= GET PROFILE =================
exports.getMe = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user._id)
      .populate("charity", "name");

    const winnings = await Winner.find({ user: req.user._id });

    const totalWins = winnings.length;

    const totalAmount = winnings.reduce(
      (acc, w) => acc + (w.prize || 0),
      0
    );

    res.json({
      user,
      winnings,
      totalWins,
      totalAmount
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch profile"
    });
  }
};