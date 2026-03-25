const express = require("express");
const router = express.Router();
const { activateSubscription } = require("../controller/subscription.controller");
const auth = require("../middleware/auth.middleware");

router.post("/activate", auth.postauthMiddleware, activateSubscription);

module.exports = router;