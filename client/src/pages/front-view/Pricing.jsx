import React from 'react'
import PriceCard from './config/PriceCard';

export default function Pricing() {
  return (
    <section className="bg-white py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#043927] mb-12">
          Price Transparency, Sensible Price, <br className="hidden sm:block" /> Flexible Contract
        </h1>
        <PriceCard/>
      </div>
    </section>
  );
}
