import React from 'react'
import './Contact.css'
import contact from '../Asset/undraw_Contact.png'

const Contact = () => {
  return (
    <div>
      <div className="contact">
        <h1>Talk to our team to get started</h1>
        <img src={contact} alt="" />
        <h3>Lets talk business</h3>
        <ul>
          <li>Phone: (123) 456-7890 </li>
          <li>Email: support@crm-solutions.com</li>
          <li>Address: 123 Business St, Suite 100, City, State</li>
        </ul>
      </div>
    </div>
  )
}

export default Contact