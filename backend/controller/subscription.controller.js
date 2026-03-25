const userModel = require("../model/user.model");

exports.activateSubscription = async (req, res) => {
  try {
    const user = req.user;
    const { plan } = req.body;

    user.subscription = {
      plan: plan || "monthly",
      status: "active"
    };

    await user.save();

    res.json({
      message: "Subscription activated",
      subscription: user.subscription
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error activating subscription" });
  }
};