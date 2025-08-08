import React from 'react';

function Projects() {
  return (
    <div
      className="rounded-2xl shadow-lg w-full lg:w-[465px] h-auto lg:h-[630px]"
      style={{backgroundColor: '#161711'}}
    >
      {/* Sidebar Container - Projects */}
      <div className="p-4 lg:p-6">
        <h2 className="text-xl lg:text-2xl font-bold mb-4 text-[#A8977A]">Projects</h2>
        <div className="space-y-4">
          <div className="p-3 lg:p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-sm lg:text-base">Project 1</h3>
            <p className="text-gray-600 text-xs lg:text-sm">Project description...</p>
          </div>
          <div className="p-3 lg:p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-sm lg:text-base">Project 2</h3>
            <p className="text-gray-600 text-xs lg:text-sm">Project description...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;