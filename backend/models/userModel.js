import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, default: false, required: true },
    role: {
      type: String,
      enum: ["user", "government", "admin"],
      default: "user",
    },
    isBlocked: { type: Boolean, default: false },
    password: { type: String },
    googleId: { type: String, unique: true },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    isAccountVerified: { type: Boolean, default: false }, // Assume verified if Google sign-in
    accountVerificationOtp: { type: String },
    accountVerificationOtpExpires: { type: Date },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

//Verify Account
userSchema.methods.createAccountVerificationOtp = async function () {
  // Generate a random 6-digit verification code
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  // Set the verification code and expiration time
  this.accountVerificationOtp = verificationCode;
  this.accountVerificationOtpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

  return verificationCode;
};

//Password Reset
userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10mins
  return resetToken;
};

//Match Password
userSchema.methods.isPasswordMatch = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
