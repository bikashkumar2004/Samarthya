import React from 'react'
import PriceCard from './PriceCard'
import './Pricing.css'

const Pricing = () => {
  return (
    <div>
      <section className='pricing mb'>
        <h1>Price Transparency, Sensible Price, <br /> Flexible Contract</h1>
        <div className='price container'>
          <PriceCard />
        </div>
      </section>
    </div>
  )
}

export default Pricing