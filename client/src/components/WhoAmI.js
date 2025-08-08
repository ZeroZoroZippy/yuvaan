import React from 'react';
import Orb from './ui/orb'

function WhoAmI() {
  return (
    <div
      className="rounded-2xl shadow-lg w-full lg:w-[590px] h-[500px] lg:h-[400px] p-4 relative"
      style={{backgroundColor: '#161711'}}
    >
      {/* Orb Component - Centered with Text Inside */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-96 h-96 lg:w-80 lg:h-80">
          <Orb />
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-4xl lg:text-4xl font-medium text-[#A8977A] text-center px-4">
              Where web meets intelligence.
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhoAmI;