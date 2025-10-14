import React, { useState } from 'react';
import { FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa';
import './Feedback.css';
import img from '../Asset/laddy1.jpg'

const feedbacks = [
  {
    image: img,
    name: 'Customer 1',
    comment: '"Cantar Solutions has transformed the way we manage our customer relationships. Highly recommended!"'
  },
  {
    image: img,
    name: 'Customer 2',
    comment: '"The sales automation features have saved us countless hours. Its a game-changer."'
  },
  {
    image: img,
    name: 'Customer 3',
    comment: '"Cantar Solutions has transformed the way we manage our customer relationships. Highly recommended!"'
  },
  {
    image: img,
    name: 'Customer 4',
    comment: '"Cantar Solutions has transformed the way we manage our customer relationships. Highly recommended!"'
  },
  {
    image: img,
    name: 'Customer 5',
    comment: '"Cantar Solutions has transformed the way we manage our customer relationships. Highly recommended!"'
  },
];

const Feedback = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextFeedback = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % feedbacks.length);
  };

  const prevFeedback = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + feedbacks.length) % feedbacks.length);
  };

  return (
    <>
    <div className="feedback-container">
        <h1>What our Clients Are Saying</h1>
      <div className="feedback">
        <img src={feedbacks[currentIndex].image} alt={feedbacks[currentIndex].name} />
        <h3>{feedbacks[currentIndex].name}</h3>
        <p>{feedbacks[currentIndex].comment}</p>
      </div>
      <div className="arrow-container">
        <FaArrowCircleLeft onClick={prevFeedback} className="arrow-icon" />
        <FaArrowCircleRight onClick={nextFeedback} className="arrow-icon" />
      </div>
    </div>
    </>
  );
};

export default Feedback;
