const express =require('express');
const authcontroller = require("../controller/auth.controller")
const authMiddleware = require("../middleware/auth.middleware")

const router = express.Router();
router.post("/register",authcontroller.postRegister);
router.post('/login',authcontroller.postlogin);
router.post('/logout',authcontroller.userlogoutcontroller);
router.get("/me", authMiddleware.postauthMiddleware, authcontroller.getMe);

router.get("/", (req, res) => {
  res.json({
    message: "Auth API working 🚀"
  });
});



module.exports =router;