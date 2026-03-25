const express = require("express");
const router = express.Router();
const { addScore,getScores } = require("../controller/score.contrroler");
const auth = require("../middleware/auth.middleware");
router.get("/", auth.postauthMiddleware, getScores);
router.post("/add", auth.postauthMiddleware, addScore);

module.exports = router;