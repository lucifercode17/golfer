const express = require("express");
const router = express.Router();
const draw = require("../controller/draw.controller");
const auth = require("../middleware/auth.middleware");

// Admin only
router.post("/run", auth.postauthMiddleware,auth.adminMiddleware, draw.runDraw);
router.get(
  "/winners",
  auth.postauthMiddleware,
  auth.adminMiddleware,
  draw.getAllWinners
);

router.put(
  "/pay/:id",
  auth.postauthMiddleware,
  auth.adminMiddleware,
  draw.markAsPaid
);

// All users
router.get("/last",auth.postauthMiddleware, draw.getLastDraw);

module.exports = router;