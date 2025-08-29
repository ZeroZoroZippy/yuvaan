import React from 'react';
import OptimizedImage from './OptimizedImage';
import Hero from '../assets/Hero/Hero1.jpg'

function HeroImage() {
  return (
    <div
      className="rounded-2xl shadow-lg w-full lg:w-[350px] h-[450px] lg:h-[400px] overflow-hidden"
      style={{ backgroundColor: '#161711' }}
    >
      <OptimizedImage
        src={Hero}
        alt="Yuvaan Vithlani - Professional web designer and developer portrait showcasing expertise in UI/UX design and modern web development"
        className="w-full h-full object-cover object-top"
        lazy={false}
      />
    </div>
  );
}

export default HeroImage;