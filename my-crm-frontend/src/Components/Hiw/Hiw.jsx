import React from 'react'
import './hiw.css'
import arrow from '../Asset/arrow3.png'

const hiw = () => {
  return (
    <div>
        <section className="how-it-works" id="how-it-works">
            <h2>How It Works</h2>
            <div className="steps">
                <div class="step">
                    <div className="icon_background">
                        <h2 className='num'>1</h2>
                    </div>
                    <img src={arrow} alt="" />
                    <h3>Sign Up</h3>
                    <p>Create your account and set up your profile in just a few minutes.</p>
                </div>
                <div className="step">
                <div className="icon_background">
                        <h2 className='num'>2</h2>
                    </div>
                    <img src={arrow} alt="" />
                    <h3>Add Contacts</h3>
                    <p>Import your contacts or add them manually to start managing your relationships.</p>
                </div>
                <div className="step">
                <div className="icon_background">
                        <h2 className='num'>3</h2>
                    </div>
                    <h3>Track Interactions</h3>
                    <p>Keep track of customer interactions, notes, and follow-ups in one place.</p>
                </div>
            </div>
        </section>
    </div>
  )
}

export default hiw