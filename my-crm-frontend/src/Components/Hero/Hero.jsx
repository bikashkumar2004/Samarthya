import React from 'react'
import './Hero.css'
import img from '../Asset/dash-cut.png'

const Hero = () => {
  return (
    <div>
      <div className="hero">
        <h1 className="hero_header">Streamline Your Business with <br />Our CRM Software</h1>
        <p>Manage your customer relationships effortlessly and grow your business.</p>
        <div className="btns">
          <button className='cta-button'>Get Started</button>
          <button className='cta-testing'>Watch Demo</button>
        </div>
        <img src={img} alt="hero-img" className='hero_img'/>
      </div>
    </div>
  )
}

export default Hero