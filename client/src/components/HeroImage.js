import React from 'react';

function HeroImage() {
  return (
    <div
      className="bg-white rounded-2xl shadow-lg w-full lg:w-[330px] h-auto lg:h-[400px]"
    >
      {/* Image Gallery Container - HeroImage */}
      <div className="p-4 lg:p-6">
        <h2 className="text-xl lg:text-2xl font-bold mb-4">Gallery</h2>
        <div className="flex items-center justify-center h-48 lg:h-64 bg-gray-100 rounded-lg">
          <p className="text-gray-500 text-sm lg:text-base">Image placeholder</p>
        </div>
      </div>
    </div>
  );
}

export default HeroImage;