import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

function AboutPage() {
    const [activeSection, setActiveSection] = useState(0);
    const [toggleStates, setToggleStates] = useState({
        webDesign: false,
        webDevelopment: false,
        brandExperience: false,
        creativeProblemSolving: false
    });

    const toggleSection = (section) => {
        setToggleStates(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Content sections with corresponding images
    const contentSections = [
        {
            id: 0,
            content: (
                <div>
                    <h1 className="text-6xl sm:text-6xl lg:text-7xl font-light text-[#A8977A] mb-16 sm:mb-8 lg:mb-10">
                        About Me
                    </h1>
                    <h3 className="text-3xl sm:text-3xl lg:text-4xl font-light text-[#A8977A] mb-4 sm:mb-6">
                        Hi, I'm Yuvaan
                    </h3>
                    <p className="text-lg sm:text-lg lg:text-xl text-[#A8977A] leading-relaxed lg:leading-relaxed mb-12 sm:mb-16 lg:mb-20">
                        I make digital experiences feel natural and effortless. I focus on what matters: clear design, smooth interactions, and details that quietly make everything work better. Every project starts with understanding your goals and ends with something people genuinely enjoy using.
                    </p>
                    <div>
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
                                href="https://instagram.com/yuv.aaaan"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center space-x-2 text-[#A8977A] hover:text-white transition-colors duration-300"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                                <span className="text-sm sm:text-base lg:text-lg">Instagram</span>
                            </a>
                        </div>
                    </div>
                </div>
            ),
            image: "https://picsum.photos/seed/developer/600/800",
            alt: "Developer at work"
        },
        {
            id: 1,
            content: (
                <div>
                    <h2 className="text-4xl sm:text-3xl lg:text-5xl font-light text-[#A8977A] mb-8 sm:mb-6">
                        What I Can Do For You
                    </h2>
                    <p className="text-lg sm:text-lg lg:text-xl text-[#A8977A] leading-relaxed lg:leading-relaxed mb-6 sm:mb-6">
                        The best work happens when creativity and collaboration meet — every project is a conversation, not just a checklist.
                    </p>
                    <p className="text-lg sm:text-lg lg:text-xl text-[#A8977A] leading-relaxed lg:leading-relaxed mb-12 sm:mb-8">
                        I design or refine websites that are enjoyable to use and easy to maintain. Interfaces stay clear, interactions feel smooth, and decisions remain practical.
                    </p>
                    <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
                        {/* Web Design */}
                        <div className="border-b border-[#A8977A]/20 pb-4">
                            <div
                                className="flex items-center justify-between cursor-pointer group"
                                onClick={() => toggleSection('webDesign')}
                            >
                                <h3 className="text-2xl sm:text-2xl lg:text-3xl font-medium text-[#A8977A] group-hover:text-white transition-colors duration-300">
                                    Web Design
                                </h3>
                                <svg
                                    className={`w-5 h-5 text-[#A8977A] transition-transform duration-300 ${toggleStates.webDesign ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {toggleStates.webDesign && (
                                <div className="mt-4 animate-fadeIn">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-4 h-4 rounded border-2 border-[#A8977A] bg-[#A8977A] flex items-center justify-center">
                                            <svg className="w-2.5 h-2.5 text-[#45372B]" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-base sm:text-lg text-[#A8977A] leading-relaxed">
                                            User‑focused layouts and typography that feel clear, consistent, and accessible.
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Web Development */}
                        <div className="border-b border-[#A8977A]/20 pb-4">
                            <div
                                className="flex items-center justify-between cursor-pointer group"
                                onClick={() => toggleSection('webDevelopment')}
                            >
                                <h3 className="text-2xl sm:text-2xl lg:text-3xl font-medium text-[#A8977A] group-hover:text-white transition-colors duration-300">
                                    Web Development
                                </h3>
                                <svg
                                    className={`w-5 h-5 text-[#A8977A] transition-transform duration-300 ${toggleStates.webDevelopment ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {toggleStates.webDevelopment && (
                                <div className="mt-4 animate-fadeIn">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-4 h-4 rounded border-2 border-[#A8977A] bg-[#A8977A] flex items-center justify-center">
                                            <svg className="w-2.5 h-2.5 text-[#45372B]" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-base sm:text-lg text-[#A8977A] leading-relaxed">
                                            Fast, responsive builds that turn designs into reliable, scalable products.
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Brand Experience */}
                        <div className="border-b border-[#A8977A]/20 pb-4">
                            <div
                                className="flex items-center justify-between cursor-pointer group"
                                onClick={() => toggleSection('brandExperience')}
                            >
                                <h3 className="text-2xl sm:text-2xl lg:text-3xl font-medium text-[#A8977A] group-hover:text-white transition-colors duration-300">
                                    Brand Experience
                                </h3>
                                <svg
                                    className={`w-5 h-5 text-[#A8977A] transition-transform duration-300 ${toggleStates.brandExperience ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {toggleStates.brandExperience && (
                                <div className="mt-4 animate-fadeIn">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-4 h-4 rounded border-2 border-[#A8977A] bg-[#A8977A] flex items-center justify-center">
                                            <svg className="w-2.5 h-2.5 text-[#45372B]" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-base sm:text-lg text-[#A8977A] leading-relaxed">
                                            Turning your story into visuals, interactions, and moments people remember.
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Creative Problem-Solving */}
                        <div className="border-b border-[#A8977A]/20 pb-4">
                            <div
                                className="flex items-center justify-between cursor-pointer group"
                                onClick={() => toggleSection('creativeProblemSolving')}
                            >
                                <h3 className="text-2xl sm:text-2xl lg:text-3xl font-medium text-[#A8977A] group-hover:text-white transition-colors duration-300">
                                    Creative Problem-Solving
                                </h3>
                                <svg
                                    className={`w-5 h-5 text-[#A8977A] transition-transform duration-300 ${toggleStates.creativeProblemSolving ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {toggleStates.creativeProblemSolving && (
                                <div className="mt-4 animate-fadeIn">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-4 h-4 rounded border-2 border-[#A8977A] bg-[#A8977A] flex items-center justify-center">
                                            <svg className="w-2.5 h-2.5 text-[#45372B]" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-base sm:text-lg text-[#A8977A] leading-relaxed">
                                            Simple, smart solutions grounded in the problem — not buzzwords.
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ),
            image: "https://picsum.photos/seed/creative/600/800",
            alt: "Creative process"
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
                                <div className="grid grid-cols-1 lg:grid-cols-[50%_35%] gap-8 lg:gap-[15%] min-h-screen">
                                    {/* Left Side - Scrollable Text Content */}
                                    <div className="space-y-24 sm:space-y-32 lg:space-y-80">
                                        {contentSections.map((section, index) => (
                                            <div
                                                key={section.id}
                                                className={`content-section min-h-[60vh] flex ${index === 0
                                                    ? 'items-start pt-16 sm:pt-16 lg:pt-24'
                                                    : index === 1
                                                        ? 'items-center mt-32 sm:mt-36 lg:mt-40'
                                                        : 'items-center'
                                                    }`}
                                            >
                                                {section.content}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Right Side - Fixed Image Container */}
                                    <div className="mt-8 sm:mt-12 lg:mt-0 lg:sticky lg:top-48 lg:w-[50vh] lg:h-[60vh] order-first lg:order-last">
                                        <div className="relative w-full h-[50vh] lg:h-full rounded-2xl overflow-hidden shadow-lg">
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;