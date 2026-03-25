const express = require("express");
const router = express.Router();
const { getCharities } = require("../controller/charity.controller");

router.get("/", getCharities);

module.exports = router;