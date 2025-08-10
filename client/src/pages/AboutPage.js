import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ScrollingGallery from '../components/ui/ScrollingGallery';

function AboutPage() {
    const [activeSection, setActiveSection] = useState(0);

    // Content sections with corresponding images
    const contentSections = [
        {
            id: 0,
            text: "I'm a web developer who designs, or a designer who codes — either way, I turn ideas into things people actually enjoy using. My work blends clean code with thoughtful design, ensuring every detail serves both function and feeling.",
            image: "https://picsum.photos/seed/developer/600/800",
            alt: "Developer at work"
        },
        {
            id: 1,
            text: "I love projects that challenge me to think differently — whether it's crafting a seamless user experience, bringing a brand's story to life, or experimenting with something new just to see where it leads. Clients and collaborators tell me they value my curiosity, my attention to detail, and the way I make the process feel easy and collaborative.",
            image: "https://picsum.photos/seed/creative/600/800",
            alt: "Creative process"
        },
        {
            id: 2,
            text: "When I'm not building or designing, you'll probably find me deep into a good book, perfecting my coffee brew, cheering for my football team, or watching a movie with my dog curled up beside me.",
            image: "https://picsum.photos/seed/lifestyle/600/800",
            alt: "Personal life"
        }
    ];

    // Handle scroll to detect which section is in view
    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('.content-section');
            const scrollPosition = window.scrollY + window.innerHeight / 2;

            sections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                    setActiveSection(index);
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);



    return (
        <div className="min-h-screen relative z-10" style={{ backgroundColor: '#45372B' }}>
            <Navbar />
            <div className="text-[#A8977A] px-4 py-6 pt-20 sm:px-6 sm:py-8 sm:pt-24 lg:px-8 lg:py-12 lg:pt-28 relative z-10">
                <div className="w-full max-w-6xl mx-auto">

                    {/* Main content */}
                    <div className="space-y-12 sm:space-y-16 lg:space-y-20">
                        {/* Split Screen Content Section */}
                        <section className="px-2 sm:px-4">
                            <div className="w-full max-w-6xl mx-auto">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-64 min-h-screen">
                                    {/* Left Side - Scrollable Text Content */}
                                    <div className="space-y-16 sm:space-y-20 lg:space-y-24">
                                        {contentSections.map((section, index) => (
                                            <div
                                                key={section.id}
                                                className={`content-section min-h-[60vh] flex ${index === 0
                                                    ? 'items-start pt-24'
                                                    : index === 1
                                                        ? 'items-center mt-32 sm:mt-36 lg:mt-40'
                                                        : 'items-center'
                                                    }`}
                                            >
                                                <div>
                                                    {index === 0 && (
                                                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#A8977A] mb-6 sm:mb-8 lg:mb-10">
                                                            About Me
                                                        </h1>
                                                    )}
                                                    <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-[#A8977A] leading-relaxed lg:leading-relaxed">
                                                        {section.text}
                                                    </p>

                                                    {index === 0 && (
                                                        <div className="mt-8 sm:mt-10 lg:mt-12">
                                                            <p className="text-base sm:text-lg lg:text-xl text-[#A8977A] mb-4 sm:mb-6">
                                                                Let's connect:
                                                            </p>
                                                            <div className="flex space-x-4 sm:space-x-6">
                                                                <a
                                                                    href="https://linkedin.com/in/yuvaanvithlani"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="group flex items-center space-x-2 text-[#A8977A] hover:text-white transition-colors duration-300"
                                                                >
                                                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                                                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                                    </svg>
                                                                    <span className="text-sm sm:text-base lg:text-lg">LinkedIn</span>
                                                                </a>

                                                                <a
                                                                    href="https://github.com/yuvaanvithlani"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="group flex items-center space-x-2 text-[#A8977A] hover:text-white transition-colors duration-300"
                                                                >
                                                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                                                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                                    </svg>
                                                                    <span className="text-sm sm:text-base lg:text-lg">GitHub</span>
                                                                </a>

                                                                <a
                                                                    href="https://twitter.com/yuvaanvithlani"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="group flex items-center space-x-2 text-[#A8977A] hover:text-white transition-colors duration-300"
                                                                >
                                                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                                                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                                                    </svg>
                                                                    <span className="text-sm sm:text-base lg:text-lg">Twitter</span>
                                                                </a>

                                                                <a
                                                                    href="mailto:yuvaan@example.com"
                                                                    className="group flex items-center space-x-2 text-[#A8977A] hover:text-white transition-colors duration-300"
                                                                >
                                                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                    </svg>
                                                                    <span className="text-sm sm:text-base lg:text-lg">Email</span>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Right Side - Fixed Image Container */}
                                    <div className="lg:sticky lg:top-48 lg:w-[50vh] lg:h-[60vh] order-first lg:order-last">
                                        <div className="relative w-full h-[40vh] lg:h-full rounded-2xl overflow-hidden shadow-lg">
                                            {contentSections.map((section, index) => (
                                                <img
                                                    key={section.id}
                                                    src={section.image}
                                                    alt={section.alt}
                                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${activeSection === index ? 'opacity-100' : 'opacity-0'
                                                        }`}
                                                />
                                            ))}

                                            {/* Optional overlay for better text readability */}
                                            <div className="absolute inset-0 bg-black/10"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Horizontal Auto-scroll Gallery */}
                        <ScrollingGallery />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;