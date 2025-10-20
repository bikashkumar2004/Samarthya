import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { verifyAccount } from "@/store/auth-slice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function EmailVerify() {
  const inputRef = useRef([]);
  const dispatch = useDispatch();
  const navigate=useNavigate();

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) {
      e.target.value = "";
      return;
    }
    if (value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      // If the field is empty, move to the previous one
      if (e.target.value === "" && index > 0) {
        inputRef.current[index - 1].focus();
      }
    }

    // Optional: allow left/right arrow navigation
    if (e.key === "ArrowLeft" && index > 0) {
      inputRef.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData
      .getData("text")
      .slice(0, inputRef.current.length);
    paste.split("").forEach((char, index) => {
      if (inputRef.current[index]) inputRef.current[index].value = char;
    });
    const lastIndex = paste.length - 1;
    if (inputRef.current[lastIndex]) inputRef.current[lastIndex].focus();
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const otp = inputRef.current.map((input) => input.value).join("");

    if (otp.length !== 6) {
      toast.warning("Please enter all 6 digits of the OTP");
      return;
    }
    const verifyAccountResponse = await dispatch(verifyAccount({ otp }));

    if (verifyAccountResponse.payload?.success) {
      toast.success(verifyAccountResponse.payload.message);
      navigate("/auth/login");
    } else {
      toast.warning(verifyAccountResponse.payload?.message || "Verification failed");
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong. Please try again.");
  }
};


  return (
    <div className="mx-auto w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-5 tracking-tight text-[#043927]">
          Enter Verify OTP
        </h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Input
              key={index}
              type="tel"
              maxLength={1}
              ref={(el) => (inputRef.current[index] = el)}
              className="w-12 h-12 text-center text-xl rounded-md border border-[#043927] focus:border-[#043927] focus:outline-none text-[#043927]"
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>
        <Button
          type="submit"
          className="w-full bg-[#043927] text-white font-semibold transition hover:bg-[#035237]"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}