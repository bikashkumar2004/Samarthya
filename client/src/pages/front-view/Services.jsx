import React from 'react'
import {services} from '../front-view/config/Data.jsx'

export default function Services() {
  return (
    <section className="py-16 px-4 bg-white">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#043927] mb-3">
          Our Services
        </h2>
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
          Improve sales, build long-lasting relationships, and grow your business with our services.
        </p>
      </div>

      {/* Service Cards */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-6
          md:gap-10
          max-w-6xl
          mx-auto
        "
      >
        {services.map(({ icon, head, desc, action, link }, index) => (
          <div
            key={index}
            className={`
              rounded-xl
              shadow-md
              p-6
              md:p-8
              transition-all
              duration-300
              ${
                index === 0
                  ? "bg-[#043927] text-white hover:bg-[#f9f9f9] hover:text-black"
                  : "bg-[#f9f9f9] hover:bg-[#043927] hover:text-white"
              }
            `}
          >
            {/* Icon */}
            <div className="inline-block p-2 bg-[#159740] rounded-md mb-4">
              <h2 className="text-2xl">{icon}</h2>
            </div>

            {/* Title */}
            <h2 className="text-xl md:text-2xl font-semibold mb-3">{head}</h2>

            {/* Description */}
            <p className="text-sm md:text-base mb-4">{desc}</p>

            {/* Action */}
            <div className="flex items-center gap-4 text-sm md:text-base mt-4">
              <p>{action}</p>
              <h2 className="font-semibold underline cursor-pointer hover:text-[#159740] transition">
                {link}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

}
