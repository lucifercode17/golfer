const Winner = require("../model/winner.model");
const userModel = require("../model/user.model");

// 🎲 RUN DRAW
exports.runDraw = async (req, res) => {
  try {
    // Generate 5 random numbers
    const drawNumbers = Array.from({ length: 5 }, () =>
      Math.floor(Math.random() * 45) + 1
    );

    const users = await userModel.find();

    const winners = [];

    for (let user of users) {
      const scores = user.scores.map(s => s.value);

      if (!scores.length) continue;

      // count matches
      const matches = scores.filter(num =>
        drawNumbers.includes(num)
      ).length;

      let result = null;

      if (matches === 5) result = "5-match";
      else if (matches === 4) result = "4-match";
      else if (matches === 3) result = "3-match";

      if (result) {
        const winner = await Winner.create({
          user: user._id,
          matches,
          result,
          drawNumbers,
          userScores: scores
        });

        winners.push(winner);
      }
    }

    res.json({
      drawNumbers,
      winners
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Draw failed ❌"
    });
  }
};
exports.getLastDraw = async (req, res) => {
  try {
    const lastDraw = await Winner.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "email name");

    res.json({
      topUsers: lastDraw,
      drawNumbers: lastDraw[0]?.drawNumbers || []
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch draw"
    });
  }
};
exports.getAllWinners = async (req, res) => {
  try {
    const winners = await Winner.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ winners });

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch winners" });
  }
};
exports.markAsPaid = async (req, res) => {
  try {
    const winner = await Winner.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: "paid" },
      { new: true }
    );

    res.json(winner);

  } catch (err) {
    res.status(500).json({ message: "Failed to update payment" });
  }
};