import { Link, useNavigate } from "react-router-dom";
import CommonForm from "../../components/common/commonForm.jsx";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/auth-slice/index.js";
import { toast } from "sonner";
import { loginFromControls } from "@/config/index.js";

const initialState = {
  email: "",
  password: "",
};

export default function Login() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("🟢 Sending login payload:", formData);

    dispatch(loginUser(formData)).then((data) => {
      if (data.payload?.success) {
        toast(data.payload?.message);

        if (data.payload?.user?.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/"); // normal user route
        }
      } else {
        toast(data.payload?.message || "Login failed");
      }
    }); // ✅ fixed missing parenthesis here
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-5 tracking-tight text-[#043927]">
          Login Your Account
        </h1>

        <CommonForm
          formControls={loginFromControls}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          buttonText="Login"
        />

        <p className="cursor-pointer text-[#043927] text-left my-1">
          Forget Password
        </p>

        <div>
          <p>
            Don’t have an Account?
            <span className="cursor-pointer underline text-[#043927] pl-2">
              <Link to="/auth/register">Register here</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
