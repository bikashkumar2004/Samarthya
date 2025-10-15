import React from 'react'
import {price} from "./Data"

export default function PriceCard() {
  return (
    <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 mt-8">
      {price.map((item, index) => (
        <div
          key={index}
          className="w-full md:w-1/3 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-8 flex flex-col items-center"
        >
          {/* Top Button */}
          {item.best && (item.plan === "Standard" ? (
            <button className="bg-green-100 text-green-600 text-sm font-medium px-4 py-2 rounded-full mb-4">
              {item.best}
            </button>
          ) : (
            <div className="h-10 mb-4" /> // Keeps layout consistent
          ))}

          {/* Plan Title */}
          <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.plan}</h3>

          {/* Price */}
          <h1 className="text-5xl font-bold text-[#043927] mb-2">
            <span className="text-2xl font-medium align-top mr-1">$</span>
            {item.price}
          </h1>

          <p className="text-gray-500 text-base mb-6">{item.ptext}</p>

          {/* Feature List */}
          <ul className="space-y-4 mb-8 w-full">
            {item.list.map((val, i) => (
              <li key={i} className="flex items-center gap-3">
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    val.change === "color"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {val.icon}
                </span>
                <p className="text-gray-700 text-sm sm:text-base">{val.text}</p>
              </li>
            ))}
          </ul>

          {/* Button */}
          <button
            className={`w-full py-3 rounded-full text-lg font-medium border transition-all duration-300 ${
              item.plan === "Standard"
                ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
                : "bg-white text-green-600 border-green-300 hover:bg-green-50"
            }`}
          >
            Start {item.plan}
          </button>
        </div>
      ))}
    </div>
  );
}
