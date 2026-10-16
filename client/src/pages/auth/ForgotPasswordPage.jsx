import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetOTP, resetPassword } from "@/store/auth-slice/index.js";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Mail,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  RefreshCw
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP & new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle Step 1: Send Reset OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your registered email address");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const response = await dispatch(resetOTP({ email }));

      if (response.payload?.success || response.payload?.message?.toLowerCase().includes("sent")) {
        toast.success(response.payload?.message || "Verification OTP sent to your email!");
        setStep(2);
      } else {
        const msg = response.payload?.message || response.error?.message || "User with this email not found";
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      console.error("Reset OTP error:", err);
      const msg = err.response?.data?.message || "Unable to send reset code. Please check your email.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // OTP inputs handling
  const handleOtpChange = (e, index) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);
    if (error) setError("");

    if (val && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim().slice(0, 6);
    if (/^\d+$/.test(pasted)) {
      const digits = pasted.split("");
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtp(newOtp);
      const focusIndex = Math.min(digits.length, 5);
      if (inputRefs.current[focusIndex]) inputRefs.current[focusIndex].focus();
    }
  };

  // Handle Step 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.warning("Please enter all 6 digits of the OTP code");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const response = await dispatch(
        resetPassword({
          email,
          otp: otpCode,
          newPassword,
        })
      );

      if (response.payload?.success) {
        toast.success(response.payload?.message || "Password reset successful! You can now log in.");
        navigate("/auth/login");
      } else {
        const msg = response.payload?.message || response.error?.message || "Failed to reset password. Please check your OTP.";
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      console.error("Reset Password error:", err);
      const msg = err.response?.data?.message || "Something went wrong while resetting password.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      const response = await dispatch(resetOTP({ email }));
      if (response.payload?.success || response.payload?.message?.toLowerCase().includes("sent")) {
        toast.success("A fresh OTP has been sent to your email.");
      } else {
        toast.warning(response.payload?.message || "Failed to resend OTP.");
      }
    } catch (err) {
      toast.error("Error resending verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden flex flex-col justify-between">
      {/* Background Ambient Glow Mesh */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-emerald-500/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[500px] bg-blue-600/10 blur-[130px] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-20 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-emerald-400 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center group-hover:bg-slate-900 transition-colors">
              <LayoutDashboard className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              Whitespace CRM
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
              Recovery
            </span>
          </div>
        </Link>

        <Link
          to="/auth/login"
          className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <span>← Back to Login</span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Security Information */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-center space-y-8 pr-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Identity Verification & Recovery</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-emerald-400 font-semibold">End-To-End Encrypted</span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Secure Password{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-300 bg-clip-text text-transparent">
                Recovery Protocol
              </span>
            </h1>

            <p className="text-base text-slate-300 max-w-xl leading-relaxed">
              Reset your credentials safely. We will dispatch a single-use 6-digit verification code to your verified email address to confirm identity before updating your password.
            </p>
          </div>

          <div className="space-y-3 text-xs text-slate-300 max-w-xl">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0 font-bold">
                1
              </div>
              <p>Enter your account email to generate a 15-minute validity reset OTP.</p>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0 font-bold">
                2
              </div>
              <p>Input the 6-digit OTP code alongside your secure new password.</p>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold">
                3
              </div>
              <p>Your password updates across all active agent workspaces immediately.</p>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Bcrypt Salted & Hashed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Zero Plaintext Exposure</span>
            </div>
          </div>
        </div>

        {/* Right Column: Step Form Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-md rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl shadow-indigo-950/50 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto mb-2">
                {step === 1 ? <Mail className="w-6 h-6" /> : <KeyRound className="w-6 h-6" />}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {step === 1 ? "Forgot Password" : "Reset Password"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {step === 1
                  ? "Enter your email to receive a password reset code"
                  : `Enter the 6-digit code sent to ${email}`}
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Step 1: Email Form */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Account Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      placeholder="anna@gmail.com"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Sending Code...</span>
                  ) : (
                    <>
                      <span>Send Recovery Code</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: OTP + New Password Form */}
            {step === 2 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {/* 6 Digit OTP */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300 text-center">
                    6-Digit Verification Code
                  </label>
                  <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        className="w-10 h-12 text-center text-lg font-bold rounded-xl bg-slate-950/90 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    New Password (min. 6 characters)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Updating Password...</span>
                  ) : (
                    <>
                      <span>Set New Password & Log In</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend Code</span>
                  </button>
                </div>
              </form>
            )}

            {/* Back to Login Link */}
            <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              Remember your password?{" "}
              <Link
                to="/auth/login"
                className="font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-4 ml-1"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-500 border-t border-slate-900">
        © {new Date().getFullYear()} Whitespace CRM Platform. All rights reserved.
      </footer>
    </div>
  );
}
