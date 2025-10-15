import { Link } from "react-router-dom";
import CommonForm from "../../components/common/commonForm.jsx";
import { registationFormControl } from "../../components/config/index.js";
import React, { useState } from "react";
const initialState={
  userName:"",
  email:"",
  password:""
}

export default function Register() {
  const [formData,setFormData]=useState(initialState)
  const handleSubmit =async(event)=>{
    event.preventDefault();
  }
  return (
    <div className="mx-auto w-full max-w-md space-y-6 ">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-5 tracking-tight text-[#043927] ">
          Create Your Account
        </h1>
        <CommonForm
          formControls={registationFormControl}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          buttonText={"Signup"}
        />
        <p className="cursor-pointer text-[#043927] text-left my-1">Forget Password</p>

        <div>
          <p>Already have an Account?<span className="cursor-pointer underline text-[#043927] pl-2"><Link to={"/auth/login"}>Login here</Link></span></p>
        </div>
      </div>
    </div>
  );
}
