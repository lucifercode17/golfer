const userModel = require("../model/user.model");
const jstoken = require("jsonwebtoken");
const tokenBlackListModel = require("../model/blacklist.model");



const mongoose = require("mongoose");

exports.postRegister = async (req, res) => {
  const { email, password, name, charity } = req.body;

  const isExits = await userModel.findOne({ email });

  if (isExits) {
    return res.status(422).json({
      message: "user already exist"
    });
  }

  // ✅ FIX HERE
  let charityId = null;

  if (charity && mongoose.Types.ObjectId.isValid(charity)) {
    charityId = charity;
  }

  const user = await userModel.create({
    email,
    password,
    name,
    charity: charityId   // ✅ ALWAYS SAFE
  });

  res.status(201).json({
    message: "Registered successfully",
    user
  });
};
exports.postlogin = async (req,res,next) =>{
  const {email,password} =req.body;
  const user = await userModel.findOne({email:email}).select("+password");
  if(!user){
    return res.status(401).json({
      message:"email or password is INVAID"
    })
  }
  const isvaildpassword = await user.comparepassword(password)
  if(!isvaildpassword){
      return res.status(401).json({
      message:"email or password is INVAID"
    })
  }
  const token = jstoken.sign({ userId: user._id }, process.env.JWT_SECRET, {
  expiresIn: "3d",
  });
  res.cookie("token", token);
  res.status(200).json({
  user: {
    _id: user._id,
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin  
  },
  token: token,
});


}

exports.userlogoutcontroller = async (req,res) =>{
  const token =req.cookies.token || req.headers.authorization?.split(" ")[1];
  if(!token){
    return res.status(200).json({
      message:"user already logged out"
    })
  }
  res.clearCookie("token")

  await tokenBlackListModel.create({
    token:token
  })
  return res.status(200).json({
    message:"user  logged out succesfully"
  })
}
const Winner = require("../model/winner.model");

exports.getMe = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user._id)
      .populate("charity", "name");

    const winnings = await Winner.find({ user: req.user._id });

    const totalWins = winnings.length;

    const totalAmount = winnings.reduce((acc, w) => acc + (w.prize || 0), 0);

    res.json({
      user,
      winnings,
      totalWins,
      totalAmount
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};
