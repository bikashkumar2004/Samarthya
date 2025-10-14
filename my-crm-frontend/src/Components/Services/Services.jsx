import React from 'react'
import './Services.css'
import { services } from '../Asset/Data'

const Services = () => {
  return (
    <div>
        <section class="services">
            <h2 className='service_header'>Our Services</h2>
            <p className='text'>Improve Sales, build long lasting relationships and grow yout business with our services</p>
            <div class="service_container">
            {services.map(({icon, head, desc, action, link}) =>{
                    return (
                        <div className="service_list">
                            <div className="service_icon">
                                <h2 className='icon'>{icon}</h2>
                            </div>
                            <h2>{head}</h2>
                            <p>{desc}</p>
                            <div className="action">
                                <p>{action}</p>
                                <h2>{link}</h2>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    </div>
  )
}

export default Services