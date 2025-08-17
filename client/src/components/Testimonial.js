import React from 'react';
import Shruti from '../assets/Testimonials/Shruti.png'

function Testimonial() {
  return (
    <div
      className="rounded-2xl shadow-lg w-full lg:w-[470px] h-[250px] sm:h-[280px] lg:h-[300px] relative"
      style={{ backgroundColor: '#161711' }}
    >
      {/* Circular Profile Image at top left */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 lg:top-6 lg:left-6">
        <img
          src={Shruti}
          alt="Dr. Shruti Shetty"
          className="w-12 h-12 sm:w-16 sm:h-16 lg:w-10 lg:h-10 rounded-full object-cover"
        />
      </div>

      {/* Name and Title at top right - same line as profile icon */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6 text-right">
        <h4 className="text-sm lg:text-base text-[#A8977A] font-medium" style={{ fontFamily: 'Bubblegum Sans, sans-serif' }}>Dr.Shruti Shetty</h4>
        <h5 className="text-xs lg:text-sm text-[#A8977A] opacity-75" style={{ fontFamily: 'Bubblegum Sans, sans-serif' }}>Sarvodaya Dental Clinic</h5>
      </div>

      {/* Testimonial Quote - pushed to bottom */}
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 lg:bottom-6 lg:left-6 lg:right-6">
        <blockquote className="text-lg sm:text-sm lg:text-[1.25rem] text-[#A8977A] leading-relaxed lg:leading-relaxed italic" style={{ fontFamily: 'Neuton, serif' }}>
          "Big shoutout to Yuvaan Vithlani for curating the website exactly how I wanted - From Patient testimonials to booking appointments all at one place !!"
        </blockquote>
      </div>
    </div>
  );
}

export default Testimonial;