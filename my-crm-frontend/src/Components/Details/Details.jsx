import React from 'react'
import './Details.css'
import img from '../Asset/m2.jpg'
import { details } from '../Asset/Data'

const Details = () => {
  return (
    <div>
        <div className="details">
          <div className="left_details">
              <img src={img} alt="details_img" />
          </div>
          <div className="right_details">
            <h2>Manage your customer relationship effortlessly with our tool</h2>
            <div className="box_container">
            {details.map(({head, icon, desc}) =>{
              return(
                  <div className="box">
                    <div className="detail_icon_container">
                        <h3 className="detail_icon">{icon}</h3>
                    </div>
                    <h2 className="detail_head">{head}</h2>
                    <p className="text">{desc}</p>
                  </div>
              )
            })}
                </div>
          </div>
        </div>
    </div>
  )
}

export default Details