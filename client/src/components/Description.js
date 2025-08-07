import React from 'react';

function Description() {
  return (
    <div
      className="rounded-2xl shadow-lg w-full lg:w-[450px] h-auto lg:h-[300px]"
      style={{backgroundColor: '#8CA083'}}
    >
      {/* Description Container */}
      <div className="p-4 lg:p-6">
        <h2 className="text-xl lg:text-2xl font-bold mb-4">About</h2>
        <p className="text-gray-600 text-sm lg:text-base">
          Add your description content here...
        </p>
      </div>
    </div>
  );
}

export default Description;