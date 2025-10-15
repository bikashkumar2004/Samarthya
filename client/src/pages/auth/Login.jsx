import { Link } from "react-router-dom";
import CommonForm from "../../components/common/commonForm.jsx";
import { loginFormControl } from "../../config/index.js";
import React, { useState } from "react";

const initialState = {
  email: "",
  password: "",
};

export default function Login() {
  const [formData, setFormData] = useState(initialState);
  const handleSubmit = async (event) => {
    event.preventDefault();
  };
  return (
    <div className="mx-auto w-full max-w-md space-y-6 ">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-5 tracking-tight text-[#043927] ">
          Login Your Account
        </h1>
        <CommonForm
          formControls={loginFormControl}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          buttonText={"Login"}
        />
        <p className="cursor-pointer text-[#043927] text-left my-1">
          Forget Password
        </p>

        <div>
          <p>
            Don't have an Account?
            <span className="cursor-pointer underline text-[#043927] pl-2">
              <Link to={"/auth/register"}>Register here</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
