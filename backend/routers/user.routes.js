const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { getAllUsers } = require("../controller/user.controller");

router.get(
  "/all",
  auth.postauthMiddleware,
  auth.adminMiddleware,
  getAllUsers
);

module.exports = router;