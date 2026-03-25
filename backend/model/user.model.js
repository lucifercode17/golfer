const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "email is required to register"],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "invalid email address",
      ],
      unique: true,
    },

    name: {
      type: String,
      required: [true, "name is required"],
    },

    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "password must be at least 6 characters"],
      select: false,
    },
    scores: [
      {
        value: {
          type: Number,
          min: 1,
          max: 45,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    subscription: {
      plan: {
        type: String,
        enum: ["monthly", "yearly"],
        default: "monthly",
      },
      status: {
        type: String,
        enum: ["active", "inactive"],
        default: "inactive",
      },
    },
    charity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Charity",
      default: null,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
});

userSchema.methods.comparepassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
