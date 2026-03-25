// IMPORTS
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require('cookie-parser')
require("dotenv").config();

// ROUTES
const authRoutes = require("./routers/auth.routes");
const scoreRouters =require("./routers/score.routes")
const drawRouters = require("./routers/draw.routes")
const subcriptionRoutes = require("./routers/subscription.routes");
const charityRouters = require("./routers/charity.routes")

// APP INIT
const app = express();

// MIDDLEWARE
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser()); 
// TEST ROUTE
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/score",scoreRouters);
app.use("/api/draw",drawRouters);
app.use("/api/subscription",subcriptionRoutes);
app.use("/api/charity",charityRouters)



PORT = process.env.PORT||5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
       console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB Error:", err);
  });