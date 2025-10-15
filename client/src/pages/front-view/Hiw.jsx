import React from 'react'
import { assets } from '../../assets/assets';

export default function Hiw() {

  return (
    <section className="text-center px-4 py-10 sm:py-14 md:py-20 bg-white" id="how-it-works">
      {/* Section Title */}
      <h2 className="text-3xl sm:text-4xl font-bold text-[#043927] mb-3">
        How It Works
      </h2>
      <p className="text-base sm:text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
        Follow these simple steps to get started with our CRM solution.
      </p>

      {/* Steps */}
      <div className="flex flex-wrap justify-center items-start gap-10 md:gap-16">
        {/* Step 1 */}
        <div className="flex flex-col items-center text-center max-w-xs">
          <div className="bg-[#159740] text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <h2 className="text-2xl font-semibold">1</h2>
          </div>
          {/* <img
            src={assets.arrow}
            alt="arrow"
            className="hidden md:block w-72 h-16 object-contain -mt-20 ml-24"
          /> */}
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Sign Up
          </h3>
          <p className="text-gray-700 text-sm sm:text-base">
            Create your account and set up your profile in just a few minutes.
          </p>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center text-center max-w-xs">
          <div className="bg-[#159740] text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <h2 className="text-2xl font-semibold">2</h2>
          </div>
          {/* <img
            src={assets.arrow}
            alt="arrow"
            className="hidden md:block w-72 h-16 object-contain -mt-20 ml-24"
          /> */}
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Add Contacts
          </h3>
          <p className="text-gray-700 text-sm sm:text-base">
            Import your contacts or add them manually to start managing your relationships.
          </p>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center text-center max-w-xs">
          <div className="bg-[#159740] text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <h2 className="text-2xl font-semibold">3</h2>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Track Interactions
          </h3>
          <p className="text-gray-700 text-sm sm:text-base">
            Keep track of customer interactions, notes, and follow-ups in one place.
          </p>
        </div>
      </div>
    </section>
  );

}
