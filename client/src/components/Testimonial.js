import React, { useState, useEffect } from 'react';
import Shruti from '../assets/Testimonials/Shruti.png';
import Aakanksha from '../assets/Testimonials/Aakanksha.JPG';

function Testimonial() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      image: Shruti,
      altText: "Dr. Shruti Shetty",
      name: "Dr. Shruti Shetty",
      title: "Lead Dentist, Sarvodaya Dental Clinic",
      quote: "Big shoutout to Yuvaan Vithlani for curating the website exactly how I wanted - From Patient testimonials to booking appointments all at one place !!"
    },
    {
      image: Aakanksha,
      altText: "Aakanksha Panday",
      name: "Aakanksha Panday",
      title: "Counseling Therapist, Therapy With Aakanksha",
      quote: "Working with Yuvaan was such a smooth and inspiring experience. He has this rare gift of turning scattered ideas into a design that feels clean, modern, and deeply personal. I'd recommend him in a heartbeat! ❤️"
    }
  ];

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const currentTestimonial = testimonials[currentIndex];

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div
      className="rounded-2xl shadow-lg w-full lg:w-[470px] h-[250px] sm:h-[280px] lg:h-[300px] relative overflow-hidden"
      style={{ backgroundColor: '#161711' }}
    >
      {/* Circular Profile Image at top left */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 lg:top-6 lg:left-6">
        <img
          src={currentTestimonial.image}
          alt={currentTestimonial.altText}
          className="w-12 h-12 sm:w-16 sm:h-16 lg:w-10 lg:h-10 rounded-full object-cover transition-all duration-700 ease-in-out transform"
          key={currentIndex}
        />
      </div>

      {/* Name and Title at top right */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6 text-right">
        <h4 
          className="text-sm lg:text-base text-[#A8977A] font-medium transition-all duration-700 ease-in-out transform" 
          style={{ fontFamily: 'Bubblegum Sans, sans-serif' }}
          key={`name-${currentIndex}`}
        >
          {currentTestimonial.name}
        </h4>
        <h5 
          className="text-xs lg:text-sm text-[#A8977A] opacity-75 transition-all duration-700 ease-in-out transform" 
          style={{ fontFamily: 'Bubblegum Sans, sans-serif' }}
          key={`title-${currentIndex}`}
        >
          {currentTestimonial.title}
        </h5>
      </div>

      {/* Testimonial Quote - pushed to bottom */}
      <div className="absolute bottom-8 left-3 right-3 sm:bottom-10 sm:left-4 sm:right-4 lg:bottom-12 lg:left-6 lg:right-6">
        <blockquote 
          className="text-lg sm:text-sm lg:text-[1.25rem] text-[#A8977A] leading-relaxed lg:leading-relaxed italic transition-all duration-700 ease-in-out transform" 
          style={{ fontFamily: 'Neuton, serif' }}
          key={`quote-${currentIndex}`}
        >
{currentTestimonial.quote}
        </blockquote>
      </div>

      {/* Dots indicator */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 rounded-full transition-all duration-500 ease-in-out transform hover:scale-125 ${
              index === currentIndex ? 'bg-[#A8977A] scale-110' : 'bg-[#A8977A] opacity-40 hover:opacity-60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default Testimonial;