import express from "express";
import {
  authMiddleware,
  isAuthenticated,
  login,
  logout,
  register,
  resetOtp,
  ResetPassword,
  sendVerifyOtp,
  verifyEmail,
} from "../../controller/auth/authController.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/send-verify-otp",authMiddleware, sendVerifyOtp);
router.post("/verify-account",authMiddleware, verifyEmail);
router.get("/is-auth",authMiddleware, isAuthenticated);
router.post("/reset-OTP",authMiddleware, resetOtp);
router.post("/reset-Password",authMiddleware, ResetPassword);

export default router;
