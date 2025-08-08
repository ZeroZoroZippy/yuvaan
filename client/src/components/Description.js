import React from 'react';

function Description() {
  return (
    <div
      className="rounded-2xl shadow-lg w-full lg:w-[470px] h-auto lg:h-[300px]"
      style={{backgroundColor: '#161711'}}
    >
      {/* Description Container */}
      <div className="p-4 lg:p-6">
        <h2 className="text-xl lg:text-2xl font-bold mb-4 text-[#A8977A]">About</h2>
        <p className="text-gray-600 text-sm lg:text-base text-[#A8977A]">
          Add your description content here...
        </p>
      </div>
    </div>
  );
}

export default Description;