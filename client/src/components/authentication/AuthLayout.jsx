
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-screen flex bg-[#f4f8f4]">
      <div className="hidden lg:flex items-center justify-center w-1/2 bg-[#043927] px-12">
        <div className="max-w-md text-center text-white space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight leading-snug">
            Welcome to our <br /> CRM Software
          </h1>
          <p className="text-lg text-gray-200">
            Manage your customers, leads, and business growth efficiently.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-8 lg:px-10 bg-[#ffffff] shadow-inner">
        <Outlet/>
      </div>
    </div>
  );
}
