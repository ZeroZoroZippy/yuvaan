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
                    <h1 className="text-3xl sm:text-4xl lg:text-6xl font-light text-[#A8977A] mb-6 sm:mb-8 lg:mb-10">
                        About Me
                    </h1>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-[#A8977A] mb-3 sm:mb-4 lg:mb-6">
                        Hi, I'm Yuvaan
                    </h3>
                    <p className="text-base sm:text-lg lg:text-xl text-[#A8977A] leading-relaxed mb-8 sm:mb-12 lg:mb-20">
                        I make digital experiences feel natural and effortless. I focus on what matters: clear design, smooth interactions, and details that quietly make everything work better. Every project starts with understanding your goals and ends with something people genuinely enjoy using.
                    </p>
                    <div>
                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6">
                            <a
                                href="https://linkedin.com/in/yuvaanvithlani"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center space-x-2 text-[#A8977A] hover:text-white transition-colors duration-300"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                                <span className="text-base sm:text-lg">LinkedIn</span>
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
                                <span className="text-base sm:text-lg">Instagram</span>
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
                    <h2 className="text-2xl sm:text-3xl lg:text-5xl font-light text-[#A8977A] mb-4 sm:mb-6 lg:mb-8">
                        What I Can Do For You
                    </h2>
                    <p className="text-base sm:text-lg lg:text-xl text-[#A8977A] leading-relaxed mb-4 sm:mb-6">
                        The best work happens when creativity and collaboration meet — every project is a conversation, not just a checklist.
                    </p>
                    <p className="text-base sm:text-lg lg:text-xl text-[#A8977A] leading-relaxed mb-6 sm:mb-8 lg:mb-12">
                        I design or refine websites that are enjoyable to use and easy to maintain. Interfaces stay clear, interactions feel smooth, and decisions remain practical.
                    </p>
                    <div className="space-y-3 sm:space-y-4 lg:space-y-5 mb-6">
                        {/* Web Design */}
                        <div className="border-b border-[#A8977A]/20 pb-3 sm:pb-4">
                            <div
                                className="flex items-center justify-between cursor-pointer group"
                                onClick={() => toggleSection('webDesign')}
                            >
                                <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#A8977A] group-hover:text-white transition-colors duration-300">
                                    Web Design
                                </h3>
                                <svg
                                    className={`w-4 h-4 sm:w-5 sm:h-5 text-[#A8977A] transition-transform duration-300 ${toggleStates.webDesign ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {toggleStates.webDesign && (
                                <div className="mt-3 sm:mt-4 animate-fadeIn">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-4 h-4 rounded border-2 border-[#A8977A] bg-[#A8977A] flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-2.5 h-2.5 text-[#45372B]" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-sm sm:text-base lg:text-lg text-[#A8977A] leading-relaxed">
                                            User‑focused layouts and typography that feel clear, consistent, and accessible.
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Web Development */}
                        <div className="border-b border-[#A8977A]/20 pb-3 sm:pb-4">
                            <div
                                className="flex items-center justify-between cursor-pointer group"
                                onClick={() => toggleSection('webDevelopment')}
                            >
                                <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#A8977A] group-hover:text-white transition-colors duration-300">
                                    Web Development
                                </h3>
                                <svg
                                    className={`w-4 h-4 sm:w-5 sm:h-5 text-[#A8977A] transition-transform duration-300 ${toggleStates.webDevelopment ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {toggleStates.webDevelopment && (
                                <div className="mt-3 sm:mt-4 animate-fadeIn">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-4 h-4 rounded border-2 border-[#A8977A] bg-[#A8977A] flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-2.5 h-2.5 text-[#45372B]" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-sm sm:text-base lg:text-lg text-[#A8977A] leading-relaxed">
                                            Fast, responsive builds that turn designs into reliable, scalable products.
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Brand Experience */}
                        <div className="border-b border-[#A8977A]/20 pb-3 sm:pb-4">
                            <div
                                className="flex items-center justify-between cursor-pointer group"
                                onClick={() => toggleSection('brandExperience')}
                            >
                                <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#A8977A] group-hover:text-white transition-colors duration-300">
                                    Brand Experience
                                </h3>
                                <svg
                                    className={`w-4 h-4 sm:w-5 sm:h-5 text-[#A8977A] transition-transform duration-300 ${toggleStates.brandExperience ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {toggleStates.brandExperience && (
                                <div className="mt-3 sm:mt-4 animate-fadeIn">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-4 h-4 rounded border-2 border-[#A8977A] bg-[#A8977A] flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-2.5 h-2.5 text-[#45372B]" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-sm sm:text-base lg:text-lg text-[#A8977A] leading-relaxed">
                                            Turning your story into visuals, interactions, and moments people remember.
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Creative Problem-Solving */}
                        <div className="border-b border-[#A8977A]/20 pb-3 sm:pb-4">
                            <div
                                className="flex items-center justify-between cursor-pointer group"
                                onClick={() => toggleSection('creativeProblemSolving')}
                            >
                                <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#A8977A] group-hover:text-white transition-colors duration-300">
                                    Creative Problem-Solving
                                </h3>
                                <svg
                                    className={`w-4 h-4 sm:w-5 sm:h-5 text-[#A8977A] transition-transform duration-300 ${toggleStates.creativeProblemSolving ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {toggleStates.creativeProblemSolving && (
                                <div className="mt-3 sm:mt-4 animate-fadeIn">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-4 h-4 rounded border-2 border-[#A8977A] bg-[#A8977A] flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-2.5 h-2.5 text-[#45372B]" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-sm sm:text-base lg:text-lg text-[#A8977A] leading-relaxed">
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

    // Handle scroll to detect which section is in view (desktop only)
    useEffect(() => {
        const handleScroll = () => {
            // Only apply scroll-based image switching on larger screens
            if (window.innerWidth >= 1024) {
                const sections = document.querySelectorAll('.content-section');
                const scrollPosition = window.scrollY + window.innerHeight / 2;

                sections.forEach((section, index) => {
                    const sectionTop = section.offsetTop;
                    const sectionBottom = sectionTop + section.offsetHeight;

                    if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                        setActiveSection(index);
                    }
                });
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen relative z-10" style={{ backgroundColor: '#45372B' }}>
            <Navbar />
            <div className="text-[#A8977A] px-4 sm:px-8 lg:px-16 py-6 pt-20 sm:pt-24 lg:pt-28 relative z-10">
                <div className="w-full max-w-6xl mx-auto">

                    {/* Main content */}
                    <div className="space-y-16 sm:space-y-24 lg:space-y-60">
                        {/* Split Screen Content Section */}
                        <section className="px-0 sm:px-2 lg:px-4">
                            <div className="w-full max-w-6xl mx-auto">
                                {/* Mobile Image - Shows on small screens at the top */}
                                <div className="block lg:hidden mb-8 sm:mb-12 pt-12">
                                    <div className="relative w-full h-[50vh] sm:h-[50vh] rounded-2xl overflow-hidden shadow-lg">
                                        <img
                                            src={contentSections[0].image}
                                            alt={contentSections[0].alt}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/10"></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-[50%_35%] gap-8 lg:gap-[15%] min-h-screen">
                                    {/* Left Side - Scrollable Text Content */}
                                    <div className="space-y-16 sm:space-y-24 lg:space-y-60">
                                        {contentSections.map((section, index) => (
                                            <div
                                                key={section.id}
                                                className={`content-section min-h-[52vh] sm:min-h-[50vh] lg:min-h-[60vh] flex ${
                                                    index === 0
                                                        ? 'items-start pt-8 lg:pt-24'
                                                        : index === 1
                                                            ? 'items-center mt-16 sm:mt-24 lg:mt-40'
                                                            : 'items-center'
                                                }`}
                                            >
                                                {section.content}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Right Side - Fixed Image Container (hidden on mobile, shown on desktop) */}
                                    <div className="hidden lg:block lg:sticky lg:top-48 lg:w-[40vh] lg:h-[60vh]">
                                        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg">
                                            {contentSections.map((section, index) => (
                                                <img
                                                    key={section.id}
                                                    src={section.image}
                                                    alt={section.alt}
                                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                                                        activeSection === index ? 'opacity-100' : 'opacity-0'
                                                    }`}
                                                />
                                            ))}
                                            <div className="absolute inset-0 bg-black/10"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Design with Strategy and Creativity Section */}
                        <section className="px-0 sm:px-2 lg:px-4 py-8 sm:py-16 lg:py-24">
                            <div className="w-full max-w-6xl mx-auto">
                                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-light text-[#A8977A] mb-6 sm:mb-8 lg:mb-12">
                                    Design with Strategy and Creativity
                                </h2>
                                <p className="text-base sm:text-lg lg:text-xl text-[#A8977A] leading-relaxed max-w-2xl mb-8 sm:mb-12 lg:mb-20">
                                    Every great digital experience starts with understanding the why behind the what. I combine strategic thinking with creative execution to build solutions that not only look exceptional but solve real problems for real people.
                                </p>

                                {/* Container Grid - Responsive */}
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-7">
                                    {/* Process Step 01 */}
                                    <div className="bg-[#161711] border border-[#A8977A]/20 rounded-2xl p-6 sm:p-8 h-80 sm:h-96 flex flex-col justify-between">
                                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#A8977A] self-start">01.</h2>
                                        <div className="self-start">
                                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#A8977A] mb-2 sm:mb-3">Research & Strategy</h3>
                                            <p className="text-sm sm:text-base lg:text-lg text-[#A8977A]/80 leading-relaxed">
                                                In this phase, I dive deep into understanding your business, target audience, and project goals. Through research and strategic planning, I create a clear roadmap to guide the entire design process.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Image 1 */}
                                    <div className="bg-[#A8977A]/10 border border-[#A8977A]/20 rounded-2xl h-80 sm:h-96 flex items-center justify-center overflow-hidden">
                                        <img src="https://picsum.photos/seed/research/300/300" alt="Research process" className="w-full h-full object-cover" />
                                    </div>

                                    {/* Process Step 02 */}
                                    <div className="bg-[#161711] border border-[#A8977A]/20 rounded-2xl p-6 sm:p-8 h-80 sm:h-96 flex flex-col justify-between">
                                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#A8977A] self-start">02.</h2>
                                        <div className="self-start">
                                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#A8977A] mb-2 sm:mb-3">Concept & Ideation</h3>
                                            <p className="text-sm sm:text-base lg:text-lg text-[#A8977A]/80 leading-relaxed">
                                                Here, I brainstorm and develop creative concepts that align with your vision. Initial sketches and ideas are refined into tangible wireframes, setting the direction for design and functionality.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Image 2 */}
                                    <div className="bg-[#A8977A]/10 border border-[#A8977A]/20 rounded-2xl h-80 sm:h-96 flex items-center justify-center overflow-hidden">
                                        <img src="https://picsum.photos/seed/ideation/300/300" alt="Ideation process" className="w-full h-full object-cover" />
                                    </div>

                                    {/* Process Step 03 - Spans 2 columns on larger screens */}
                                    <div className="md:col-span-2 bg-[#A8977A] border border-[#A8977A]/20 rounded-2xl p-6 sm:p-8 h-80 sm:h-96 flex flex-col justify-between">
                                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#45372B] self-start">03.</h2>
                                        <div className="self-start max-w-2xl">
                                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#45372B] mb-2 sm:mb-3">Feedback & Refinement</h3>
                                            <p className="text-sm sm:text-base lg:text-lg text-[#45372B] leading-relaxed">
                                                Collaboration is key. I review the design with you, gather feedback, and refine the work to align with your expectations and goals. This ensures the design reflects your vision.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Process Step 04 */}
                                    <div className="bg-[#A8977A]/10 border border-[#A8977A]/20 rounded-2xl p-6 sm:p-8 h-80 sm:h-96 flex flex-col justify-between">
                                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#A8977A] self-start">04.</h2>
                                        <div className="self-start">
                                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#A8977A] mb-2 sm:mb-3">Testing & Optimization</h3>
                                            <p className="text-sm sm:text-base lg:text-lg text-[#A8977A]/80 leading-relaxed">
                                                I conduct thorough testing to identify and resolve any performance or usability issues. This phase ensures the design works seamlessly across devices and meets user experience standards.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Image 3 */}
                                    <div className="bg-[#A8977A]/10 border border-[#A8977A]/20 rounded-2xl h-80 sm:h-96 flex items-center justify-center overflow-hidden">
                                        <img src="https://picsum.photos/seed/testing/300/300" alt="Testing process" className="w-full h-full object-cover" />
                                    </div>

                                    {/* Process Step 05 */}
                                    <div className="bg-[#A8977A]/10 border border-[#A8977A]/20 rounded-2xl p-6 sm:p-8 h-80 sm:h-96 flex flex-col justify-between">
                                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#A8977A] self-start">05.</h2>
                                        <div className="self-start">
                                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#A8977A] mb-2 sm:mb-3">Launch & Delivery</h3>
                                            <p className="text-sm sm:text-base lg:text-lg text-[#A8977A]/80 leading-relaxed">
                                                Once everything is finalized, the project is launched and delivered to you. I also provide guidance or support for ongoing maintenance to ensure long-term success.
                                            </p>
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