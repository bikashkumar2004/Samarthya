import React from "react";
import { assets } from "../../assets/assets";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center w-full  bg-[#dbe9db] text-center px-4 pt-5 sm:pt-4 md:pt-5 pb-3">
      <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#043927] leading-snug md:leading-tight max-w-3xl">
        Streamline Your Business with <br className="hidden sm:block" /> 
        Our CRM Software
      </h1>
      <p className="text-sm sm:text-base md:text-lg text-gray-700 mt-3 sm:mt-4 max-w-md sm:max-w-xl md:max-w-2xl">
        Manage your customer relationships effortlessly and grow your business.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 md:gap-8 mt-6">
        <button className="px-8 py-3 md:px-10 md:py-4 bg-[#043927] text-white rounded-md font-semibold hover:bg-[#022f20] transition">
          Get Started
        </button>
        <button className="px-8 py-3 md:px-10 md:py-4 bg-[#159740] text-white rounded-md font-semibold hover:bg-[#128b38] transition">
          Watch Demo
        </button>
      </div>
      <div className="mt-10 sm:mt-14 md:mt-16 w-full max-w-sm sm:max-w-2xl md:max-w-4xl px-2">
        <img
          src={assets.dash}
          alt="CRM Dashboard"
          className="w-full h-auto object-contain rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
}

