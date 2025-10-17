import { Link, useNavigate } from "react-router-dom";
import CommonForm from "../../components/common/commonForm.jsx";
import { registationFormControl } from "../../config/index.js";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser, sendVerifyOTP } from "@/store/auth-slice/index.js";
import { toast } from "sonner";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

export default function Register() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const data = await dispatch(registerUser(formData)).unwrap();

      if (data.success) {
        toast.success(data.message);

        // after successful registration, send OTP to verify email
        const otpResponse = await dispatch(sendVerifyOTP({ formData })).unwrap();
        toast.success(otpResponse.message);

        // redirect to OTP verification page
        navigate("/auth/send-verify-otp");
      } else {
        toast.warning(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong during registration");
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-5 tracking-tight text-[#043927]">
          Create Your Account
        </h1>

        <CommonForm
          formControls={registationFormControl}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleRegister} // ✅ Only one handleSubmit
          buttonText={"Signup"}
        />

        <p className="cursor-pointer text-[#043927] text-left my-1">
          Forget Password
        </p>

        <div>
          <p>
            Already have an Account?
            <span className="cursor-pointer underline text-[#043927] pl-2">
              <Link to={"/auth/login"}>Login here</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}