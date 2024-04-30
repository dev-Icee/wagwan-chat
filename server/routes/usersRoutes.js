import {
  signup,
  login,
  forgetPassword,
  resetPassword,
  updatePassword,
  logout
} from "./../controllers/authController.js";

import express from "express";

const router = express.Router();

router.post("/signup", signup);
router.get("/logout", logout);

router.post("/login", login);
router.post("/forgetPassword", forgetPassword);
router.patch("/resetPassword/:token", resetPassword);

// router.use(protect);
// router.get("/me", userController.getMe, userController.getUser);
router.patch("/updateMyPassword", updatePassword);
// router.patch("/updateMe", userController.changeMe);
export default router;
