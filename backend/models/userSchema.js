import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Firstname is required!"],
    minlength: [2, "Firstame must consist 2 characters!"],
  },

  email: {
    type: String,
    required: [true, "Email is required!"],
    validate: [validator.isEmail, "Please provide a valid Email!"],
  },
  number: {
    type: String,
    // required: [true, "Number is required!"],
    minlength: [10, "Number must consist exactly 10 characters!"],
    maxlength: [10, "Number must consist exactly 10 characters!"],
  },

  password: {
    type: String,
    required: [true, "Password is required!"],
    minlength: [8, "Password must consist at least 8 characters!"],
    select: false,
    
  },
  googleId: {
    type: String,
  },
  type: {
    type: String,
    enum: ["User", "Admin", "Doctor"],
    default: "User",
  },
  doctorDepartment: {
    type: String,
  },
  docAvatar: {
    public_id: String,
    url: String,
  },
  userAvatar: {
    public_id: String,
    url: String,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  isVerified: {
    type: Boolean,
    default: false,
  },
  reports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Report' }],
  verificationToken: String,
  verificationTokenExpire: Date,
  subscription:{
    plan: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
    credits:{
      type: Number,
      default: 100,
      min: 0,
    }
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set token expire time
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.getVerificationToken = function () {
  const verificationToken = crypto.randomBytes(20).toString("hex");

  this.verificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  this.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return verificationToken;
};

export const User = mongoose.model("users", userSchema);
