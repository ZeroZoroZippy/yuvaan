import React from 'react';

function WhoAmI() {
  return (
    <div
      className="bg-white rounded-2xl shadow-lg w-full lg:w-[570px] h-auto lg:h-[400px]"
    >
      {/* Main Content Container - WhoAmI */}
      <div className="p-4 lg:p-6">
        <h2 className="text-xl lg:text-2xl font-bold mb-4">Who Am I</h2>
        <p className="text-gray-600 text-sm lg:text-base">
          Add your main content here...
        </p>
      </div>
    </div>
  );
}

export default WhoAmI;