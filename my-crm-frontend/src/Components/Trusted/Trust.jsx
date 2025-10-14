import React from 'react'
import './Trust.css'
import netflix from '../Asset/netflix_logo.png'
import stripe from '../Asset/stripe.png'
import yahoo from '../Asset/yahoo.png'
import facebook from '../Asset/fb logo.png'
import zapier from '../Asset/zapier_logo.png'

const Trust = () => {
  return (
    <div>
        <div className="trusted">
            <div className="trust_header">
                <h3>Trusted Partners</h3>
            </div>
            <div className="trusted-patners">
                <img src={netflix} alt="partner-img" className='partner-img'/>
                <img src={stripe} alt="partner-img" className='partner-img' />
                <img src={yahoo} alt="partner-img" className='partner-img' />
                <img src={facebook} alt="partner-img" className='partner-img' />
                <img src={zapier} alt="partner-img" className='partner-img' />
            </div>
        </div>
    </div>
  )
}

export default Trust