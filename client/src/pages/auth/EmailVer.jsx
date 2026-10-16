import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyAccount } from "@/store/auth-slice/index.js";
import { toast } from "sonner";
import {
  LayoutDashboard,
  KeyRound,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Mail
} from "lucide-react";

export default function EmailVer() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (error) setError("");

    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split("");
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);
      const focusIndex = Math.min(digits.length, 5);
      if (inputRefs.current[focusIndex]) inputRefs.current[focusIndex].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.warning("Please enter all 6 digits of the verification code");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const response = await dispatch(verifyAccount({ otp: otpCode }));

      if (response.payload?.success) {
        toast.success(response.payload?.message || "Email verified successfully!");
        navigate("/auth/login");
      } else {
        const msg = response.payload?.message || "Invalid or expired verification code";
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      console.error("Verification error:", err);
      const msg = "Verification failed. Please try again.";
      setError(msg);
      toast.error(msg);
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
              Security
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

      {/* Centered OTP Box */}
      <main className="relative z-10 max-w-lg w-full mx-auto px-6 py-12 flex-1 flex items-center justify-center">
        <div className="w-full rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl shadow-indigo-950/50 space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
            <KeyRound className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Verify Your Email
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
              Please enter the 6-digit verification code sent to your registered email address.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 6 Digit Inputs */}
            <div className="flex justify-center gap-2.5 sm:gap-3" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-11 h-14 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl bg-slate-950/90 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isLoading ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <span>Verify & Proceed to Login</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-xs text-slate-400 border-t border-slate-800/80">
            Didn't receive the email?{" "}
            <button
              type="button"
              onClick={() => toast.info("New verification code dispatched.")}
              className="font-semibold text-indigo-400 hover:text-indigo-300 ml-1"
            >
              Resend Code
            </button>
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
