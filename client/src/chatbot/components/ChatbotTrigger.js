import React from 'react';
import { useChatbot } from '../context/ChatbotContext';
import { useAnalytics } from '../../hooks/useAnalytics';
import Orb from '../../components/ui/orb';

const ChatbotTrigger = () => {
    const { isOpen, openChatbot, leadData } = useChatbot();
    const { trackChatbot, trackCTA } = useAnalytics();

    const handleOrbClick = () => {
        trackCTA('floating_chatbot_trigger', 'chatbot_open', {
            context: 'floating_orb',
            currentPage: window.location.pathname,
            deviceType: window.innerWidth >= 768 ? 'desktop' : 'mobile'
        });
        trackChatbot('open', 0, 'floating_trigger');
        
        openChatbot();
    };

    // Don't render if chatbot is open
    if (isOpen) return null;

    return (
        <>
            {/* Desktop Floating Orb */}
            <div className="hidden md:block">
                <div
                    className="fixed bottom-6 right-6 w-20 h-20 z-[9998] cursor-pointer group transition-all duration-300 hover:scale-110"
                    onClick={handleOrbClick}
                >
                    <Orb
                        hue={leadData?.qualificationLevel === 'high' ? 120 : 220}
                        hoverIntensity={0.3}
                        rotateOnHover={true}
                        forceHoverState={false}
                    />
                    
                    {/* Subtle pulse animation */}
                    <div className="absolute inset-0 rounded-full border-2 border-[#A8977A]/30 animate-pulse opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full right-0 mb-4 bg-[#161711] text-[#A8977A] px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none whitespace-nowrap border border-[#A8977A]/20">
                        <span style={{ fontFamily: 'var(--font-sans)' }}>Talk to Saarth</span>
                        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#161711]"></div>
                    </div>
                </div>
            </div>

            {/* Mobile Floating Orb */}
            <div className="md:hidden">
                <div
                    className="fixed bottom-6 right-6 w-16 h-16 z-[9998] cursor-pointer group transition-all duration-300 active:scale-95"
                    onClick={handleOrbClick}
                >
                    <Orb
                        hue={leadData?.qualificationLevel === 'high' ? 120 : 220}
                        hoverIntensity={0.3}
                        rotateOnHover={true}
                        forceHoverState={false}
                    />
                    
                    {/* Mobile pulse animation */}
                    <div className="absolute inset-0 rounded-full border-2 border-[#A8977A]/30 animate-pulse opacity-50 group-active:opacity-80 transition-opacity duration-300"></div>
                    
                    {/* Mobile notification badge for high-quality leads */}
                    {leadData?.qualificationLevel === 'high' && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-bounce"></div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ChatbotTrigger;