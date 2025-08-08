import React from 'react';

function SocialMedia() {
  return (
    <div
      className="rounded-2xl shadow-lg w-full lg:w-[465px] h-auto lg:h-[70px]"
      style={{backgroundColor: '#161711'}}
    >
      {/* Social Media Container */}
      <div className="p-4 flex items-center justify-center">
        <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
          <a href="#" className="text-blue-600 hover:text-blue-800 text-sm lg:text-base">
            LinkedIn
          </a>
          <a href="#" className="text-blue-400 hover:text-blue-600 text-sm lg:text-base">
            Twitter
          </a>
          <a href="#" className="text-gray-800 hover:text-gray-600 text-sm lg:text-base">
            GitHub
          </a>
          <a href="#" className="text-pink-600 hover:text-pink-800 text-sm lg:text-base">
            Instagram
          </a>
        </div>
      </div>
    </div>
  );
}

export default SocialMedia;