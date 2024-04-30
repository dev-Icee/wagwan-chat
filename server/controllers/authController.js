import { promisify } from "util";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import Users from "../models/userModel.js";
import AppError from "../utils/AppError.js";
import sendMail from "../utils/sendMail.js";

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, res, statusCode) => {
  const token = signToken(user._id);
  user.password = undefined;

  const cookieOptions = {
    httpOnly: true
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user }
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const userExists = await Users.findOne({ email: req.body.email });

  if (userExists) {
    return next(new AppError("User already exists.", 400));
  }

  const user = await Users.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  createSendToken(user, res, 201);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Provide a valid email and password", 404));
  }

  const user = await Users.findOne({ email }).select("+password");

  const match = await user.confirmPassword(password, user.password);

  if (!user || !match)
    return next(new AppError("Invalid email or password", 400));

  createSendToken(user, res, 200);
});

export const forgetPassword = catchAsync(async (req, res, next) => {
  const user = await Users.findOne(req.body);

  if (!user) return next(new AppError("This user does not exist", 404));

  const resetToken = user.generatePasswordResetToken();

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendMail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!"
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

export const protect = catchAsync(async (req, res, next) => {
  console.log(req.headers.authorization);
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  }
  console.log(token);
  if (!token) return next(new AppError("User is not logged in"), 404);

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await Users.findById(decoded.id);
  if (!currentUser)
    return new AppError(
      "User belonging to this token does not longer exist!",
      404
    );

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .dispatch("hex");

  const user = await Users.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: Date.now() }
  });

  if (!user) return next(new AppError("Token is invalid or expires", 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.paswordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const user = await Users.findById(req.body.id).select("+password");

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordconfirm;
  await user.save();

  createSendToken(user, 200, res);
});

export const logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res
    .status(200)
    .json({ status: "success", message: "User logged out succefully" });
};
