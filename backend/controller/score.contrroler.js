const userModel = require("../model/user.model")

exports.addScore = async (req, res) => {
  try {

    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ message: "User ID missing in token" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { value } = req.body;

    if (value < 1 || value > 45) {
      return res.status(400).json({ message: "Score must be between 1-45" });
    }

    if (user.scores.length >= 5) {
      user.scores.shift();
    }

    user.scores.push({ value });

    await user.save();

  res.status(200).json({
    scores: user.scores
  })

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getScores = async (req, res) => {
  const user = req.user;

  res.json({
    scores: user.scores.slice().reverse()
  });
};