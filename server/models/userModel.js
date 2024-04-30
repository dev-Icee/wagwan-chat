import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"]
  },
  email: {
    type: String,
    unique: [true],
    required: [true, "Please enter your email"],
    validate: [validator.isEmail, "Enter a valid email"]
  },
  password: {
    type: String,
    minLength: [6, "password must be at least 6 chracters"],
    required: [true, "Enter your password"],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, "confirm your password"],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: "password does not match."
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  tokenExpTime: Date
});

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  this.passwordConfirm = undefined;

  next();
});

userSchema.method("confirmPassword", async function(enteredPassword, password) {
  return await bcrypt.compare(enteredPassword, password);
});

userSchema.methods.passwordAfter = JwtTimeStamp => {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JwtTimeStamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.method("generatePasswordResetToken", function() {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.tokenExpTime = Date.now() + 10 * 60 * 1000;

  return resetToken;
});

const Users = new mongoose.model("Users", userSchema);

export default Users;
