import React from 'react'
import { assets } from '../../assets/assets';
import { details } from '../front-view/config/Data.jsx';

export default function Details() {

  return (
    <section className="bg-[#043927] text-white py-16 px-4 md:px-12 lg:px-24 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 mt-20 ">
      {/* Left Image */}
      <div className="w-full lg:w-1/2 flex justify-center">
        <img
          src={assets.m2}
          alt="details_img"
          className="w-[90%] md:w-[450px] lg:w-[500px] h-[400px] md:h-[550px] lg:h-[680px] object-cover rounded-3xl shadow-lg"
        />
      </div>

      {/* Right Content */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <h2 className="text-2xl md:text-3xl font-semibold leading-snug mb-10 text-start">
          Manage your customer relationship effortlessly with our tool
        </h2>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {details.map(({ head, icon, desc }, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 bg-transparent hover:bg-[#0b533a] transition-all duration-300 rounded-2xl p-4 md:p-6 shadow-md hover:shadow-lg"
            >
              {/* Icon */}
              <div className="bg-white w-10 h-8 rounded-lg flex items-center justify-center mb-2">
                <h3 className="text-[#0ed851] text-xl">{icon}</h3>
              </div>

              {/* Text */}
              <h2 className="text-lg md:text-xl font-semibold ml-1">{head}</h2>
              <p className="text-sm md:text-base text-gray-200 ml-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

}
