import React from 'react';
import Hero from '../assets/Hero/Hero1.jpg'

function HeroImage() {
  return (
    <div
      className="rounded-2xl shadow-lg w-full lg:w-[350px] h-[450px] lg:h-[400px] overflow-hidden"
      style={{ backgroundColor: '#161711' }}
    >
      <img
        src={Hero}
        alt="Yuvaan Vithlani - Digital Solutions Strategist"
        className="w-full h-full object-cover object-top"
      />
    </div>
  );
}

export default HeroImage;