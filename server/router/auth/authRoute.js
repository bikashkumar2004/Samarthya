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
router.post("/send-verify-otp", sendVerifyOtp, authMiddleware);
router.post("/verify-account", verifyEmail, authMiddleware);
router.get("/is-auth", isAuthenticated, authMiddleware);
router.post("/reset-OTP", resetOtp, authMiddleware);
router.post("/reset-Password", ResetPassword, authMiddleware);

export default router;
