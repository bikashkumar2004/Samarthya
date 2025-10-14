import React from 'react'
import './About.css'
import about_img from '../Asset/undraw_About.png'

const About = () => {
  return (
    <div>
      <div className="about">
      <h1 className="about_text">The #1 CRM Solutions For <br />Businesses Of All Kind</h1>
        <img src={about_img} alt="" />
        <p className="about_desc">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Libero error consequuntur, quibusdam ut eos hic labore in laboriosam culpa suscipit molestiae alias quis eaque maiores ea sed fugiat necessitatibus blanditiis!
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo quibusdam ipsam repellendus velit odit eum, iusto recusandae soluta dolorum porro? Totam repellat, natus recusandae repellendus pariatur voluptate tempore? Neque, ea!
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quibusdam inventore dolore itaque omnis adipisci quasi dolorem dolor, eos eius expedita molestias animi, maiores reiciendis quaerat consequatur odio. Quam, dicta totam.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia reiciendis quae nemo voluptate, magni, laborum beatae suscipit cupiditate deserunt, aliquam tenetur minus nobis ratione possimus harum cumque neque dignissimos consequuntur.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam tempora id quod nam vero. Quia provident, repellendus quibusdam accusamus asperiores natus tempore libero vel, odio aut officiis, illum dolorem nesciunt?
        </p>
      </div>
    </div>
  )
}

export default About