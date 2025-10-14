import React from 'react'
import Hero from '../Hero/Hero'
import Faq from '../FAQ/Faq'
import Trust from '../Trusted/Trust'
import Hiw from '../Hiw/Hiw'
import Services from '../Services/Services'
import Details from '../Details/Details'
import Trial from '../Trial/Trail'
import Feedback from '../Feedback/Feedback'

const Home = () => {
  return (
    <div>
      <Hero />
      <Trust />
      <Hiw />
      <Services />
      <Details />
      <Faq />
      <Trial />
      <Feedback />
    </div>
  )
}

export default Home