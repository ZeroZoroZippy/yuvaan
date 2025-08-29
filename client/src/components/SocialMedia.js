import React from 'react';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';
import { useAnalytics } from '../hooks/useAnalytics';

function SocialMedia() {
    const { trackSocial, trackCTA } = useAnalytics();
    const iconColor = '#A8977A';

    return (
        <div
            className="rounded-2xl shadow-lg w-full lg:w-[465px] h-16 lg:h-[70px] mb-2 lg:mb-0"
            style={{ backgroundColor: '#161711' }}
        >
            {/* Social Media Container */}
            <div className="flex items-center justify-center h-full w-full px-4 py-3 lg:px-0 lg:py-0">
                <div className="flex justify-center items-center gap-10 lg:gap-12">
                    <a
                        href="https://www.linkedin.com/in/yuvaanvithlani/"
                        className="hover:opacity-80 active:opacity-60 transition-opacity duration-200 flex items-center justify-center p-2 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#A8977A] focus:ring-offset-2 focus:ring-offset-[#161711]"
                        style={{ color: iconColor }}
                        aria-label="Visit Yuvaan Vithlani's LinkedIn profile"
                        onClick={() => {
                            trackSocial('linkedin', 'https://www.linkedin.com/in/yuvaanvithlani/', 'footer');
                            trackCTA('footer_linkedin', 'social_media', {
                                platform: 'linkedin',
                                context: 'footer_social_media',
                                currentPage: window.location.pathname
                            });
                        }}
                    >
                        <FaLinkedin className="w-7 h-7 lg:w-8 lg:h-8" />
                    </a>
                    <a
                        href="https://www.instagram.com/yuv.aaaan/"
                        className="hover:opacity-80 active:opacity-60 transition-opacity duration-200 flex items-center justify-center p-2 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#A8977A] focus:ring-offset-2 focus:ring-offset-[#161711]"
                        style={{ color: iconColor }}
                        aria-label="Visit Yuvaan Vithlani's Instagram profile"
                        onClick={() => {
                            trackSocial('instagram', 'https://www.instagram.com/yuv.aaaan/', 'footer');
                            trackCTA('footer_instagram', 'social_media', {
                                platform: 'instagram',
                                context: 'footer_social_media',
                                currentPage: window.location.pathname
                            });
                        }}
                    >
                        <FaInstagram className="w-7 h-7 lg:w-8 lg:h-8" />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default SocialMedia;