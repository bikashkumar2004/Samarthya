import React from 'react'
import { assets } from '../../assets/assets';

export default function Footer() {

  return (
    <footer className="bg-[#043927] text-white flex flex-col items-center gap-8 px-[8vw] py-20 mt-8">
      <div className="w-full grid md:grid-cols-4 gap-20">
        {/* Left Section */}
        <div className="flex flex-col items-start gap-5 md:col-span-2">
          <h2 className="text-2xl font-semibold mb-2">CANTAR</h2>
          <p>
            CRM Solutions is dedicated to helping businesses manage their customer relationships and grow efficiently with our comprehensive CRM software.
          </p>
          <div className="flex gap-4 mt-5">
            <img src={assets.facebook} alt="Facebook" className="w-10" />
            <img src={assets.twitter} alt="Twitter" className="w-10" />
            <img src={assets.linkdin} alt="LinkedIn" className="w-10" />
          </div>
        </div>

        {/* Center Section */}
        <div className="flex flex-col items-start gap-3">
          <h2 className="text-xl font-semibold">COMPANY</h2>
          <ul className="space-y-2">
            <li className="cursor-pointer">Home</li>
            <li className="cursor-pointer">About Us</li>
            <li className="cursor-pointer">Services</li>
            <li className="cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-start gap-3">
          <h2 className="text-xl font-semibold">GET IN TOUCH</h2>
          <ul className="space-y-2">
            <li>Phone: (123) 456-7890</li>
            <li>Email: support@crm-solutions.com</li>
            <li>Address: 123 Business St, Suite 100, City, State</li>
          </ul>
        </div>
      </div>

      <hr className="w-full h-[2px] bg-gray-500 border-none my-5" />
      <p className="text-center">Copyright 2024 @Company. All rights Reserved</p>
    </footer>
  );


}
