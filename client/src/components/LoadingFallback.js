import React from 'react';

const LoadingFallback = ({ message = "Loading..." }) => {
    return (
        <div className="min-h-screen bg-[#45372B] flex items-center justify-center">
            <div className="text-center">
                {/* Animated loading orb */}
                <div className="w-16 h-16 mx-auto mb-6 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-[#A8977A]/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#A8977A] animate-spin"></div>
                    <div className="absolute inset-2 rounded-full bg-[#A8977A]/10 animate-pulse"></div>
                </div>
                
                {/* Loading text */}
                <h2 className="text-xl font-light text-[#A8977A] mb-2" style={{ fontFamily: 'Bubblegum Sans, sans-serif' }}>
                    {message}
                </h2>
                
                {/* Loading dots animation */}
                <div className="flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-[#A8977A] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-[#A8977A] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-[#A8977A] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingFallback;