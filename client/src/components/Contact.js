import React from 'react';

function Contact() {
  return (
    <div
      className="rounded-2xl shadow-lg w-full lg:w-[470px] h-auto lg:h-[300px]"
      style={{backgroundColor: '#A8977A'}}
    >
      {/* Contact Container */}
      <div className="p-4 lg:p-6">
        <h2 className="text-xl lg:text-2xl font-bold mb-4 text-[#45372B]">Contact</h2>
        <div className="space-y-3">
          <div>
            <p className="text-gray-600 text-sm lg:text-base text-[#45372B]">Email: your.email@example.com</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm lg:text-base text-[#45372B]">Phone: +1 (555) 123-4567</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm lg:text-base text-[#45372B]">Location: Your City, Country</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;