import React, { useState, useEffect, useRef } from 'react';
import { usePageTransition } from '../contexts/PageTransitionContext';
import { useLenisContext } from '../contexts/LenisContext';
import Navbar from '../components/Navbar';
import ScrollingGallery from '../components/ui/ScrollingGallery';
import Footer from '../components/Footer';

function AboutPage() {
    const { isTransitioning } = usePageTransition();
    const [activeSection, setActiveSection] = useState(0);
    const [toggleStates, setToggleStates] = useState({
        webDesign: false,
        webDevelopment: false,
        brandExperience: false,
        creativeProblemSolving: false
    });

    // Contact form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');
    const [showThankYou, setShowThankYou] = useState(false);

    // Animation and content loading state
    const [animatedElements, setAnimatedElements] = useState(new Set());
    const [contentLoaded, setContentLoaded] = useState(false);
    const [showContent, setShowContent] = useState(false);

    // Get Lenis instance from context
    const lenis = useLenisContext();
    const observerRef = useRef();

    const toggleSection = (section) => {
        setToggleStates(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Contact form handlers
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('');

        try {
            const response = await fetch('http://localhost:8000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitStatus('success');
                setShowThankYou(true);
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackToForm = () => {
        setShowThankYou(false);
        setSubmitStatus('');
        setFormData({ name: '', email: '', message: '' });
    };

    // Content sections with corresponding images
    const contentSections = [
        {
            id: 0,
            content: (
                <div>
                    <h1
                        className="text-3xl sm:text-4xl lg:text-6xl font-light text-[#A8977A] mb-6 sm:mb-8 lg:mb-10"
                        data-animation="fade-scale-in"
                        data-delay="0"
                        style={{ fontFamily: 'Syne, sans-serif' }}
                    >
                        About Me
                    </h1>
                    <h3
                        className="text-xl sm:text-2xl lg:text-3xl font-light text-[#A8977A] mb-3 sm:mb-4 lg:mb-6"
                        data-animation="slide-up-fade"
                        data-delay="200"
                        style={{ fontFamily: 'Syne, sans-serif' }}
                    >
                        Hi, I'm Yuvaan
                    </h3>
                    <p
                        className="text-base sm:text-lg lg:text-xl text-[#A8977A] leading-relaxed mb-8 sm:mb-12 lg:mb-20"
                        data-animation="slide-up-fade"
                        data-delay="400"
                        style={{ fontFamily: 'Neuton, serif' }}
                    >
                        I make digital experiences feel natural and effortless. I focus on what matters: clear design, smooth interactions, and details that quietly make everything work better. Every project starts with understanding your goals and ends with something people genuinely enjoy using.
                    </p>
                    <div
                        data-animation="slide-up-fade"
                        data-delay="600"
                    >
                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6">
                            <a
                                href="https://linkedin.com/in/yuvaanvithlani"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center space-x-2 text-[#A8977A] hover:text-white transition-all duration-500 hover:scale-105 hover:translate-x-2"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                                <span className="text-base sm:text-lg" style={{ fontFamily: 'Neuton, serif' }}>LinkedIn</span>
                            </a>

                            <a
                                href="https://instagram.com/yuv.aaaan"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center space-x-2 text-[#A8977A] hover:text-white transition-all duration-500 hover:scale-105 hover:translate-x-2"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                                <span className="text-base sm:text-lg" style={{ fontFamily: 'Neuton, serif' }}>Instagram</span>
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
                    <h2
                        className="text-2xl sm:text-3xl lg:text-5xl font-light text-[#A8977A] mb-4 sm:mb-6 lg:mb-8"
                        data-animation="fade-scale-in"
                        data-delay="0"
                        style={{ fontFamily: 'Syne, sans-serif' }}
                    >
                        What I Can Do For You
                    </h2>
                    <p
                        className="text-base sm:text-lg lg:text-xl text-[#A8977A] leading-relaxed mb-4 sm:mb-6"
                        data-animation="slide-up-fade"
                        data-delay="200"
                        style={{ fontFamily: 'Neuton, serif' }}
                    >
                        The best work happens when creativity and collaboration meet – every project is a conversation, not just a checklist.
                    </p>
                    <p
                        className="text-base sm:text-lg lg:text-xl text-[#A8977A] leading-relaxed mb-6 sm:mb-8 lg:mb-12"
                        data-animation="slide-up-fade"
                        data-delay="400"
                        style={{ fontFamily: 'Neuton, serif' }}
                    >
                        I design or refine websites that are enjoyable to use and easy to maintain. Interfaces stay clear, interactions feel smooth, and decisions remain practical.
                    </p>
                    <div
                        className="space-y-3 sm:space-y-4 lg:space-y-5 mb-6"
                        data-animation="slide-up-fade"
                        data-delay="600"
                    >
                        {/* Web Design */}
                        <div className="border-b border-[#A8977A]/20 pb-3 sm:pb-4 transform transition-all duration-300 hover:scale-[1.02] hover:bg-[#A8977A]/5 hover:rounded-lg hover:px-4 hover:py-2">
                            <div
                                className="flex items-center justify-between cursor-pointer group"
                                onClick={() => toggleSection('webDesign')}
                            >
                                <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#A8977A] group-hover:text-white transition-all duration-500 group-hover:translate-x-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                                    Web Design
                                </h3>
                                <svg
                                    className={`w-4 h-4 sm:w-5 sm:h-5 text-[#A8977A] transition-all duration-500 group-hover:text-white group-hover:scale-110 ${toggleStates.webDesign ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {toggleStates.webDesign && (
                                <div className="mt-3 sm:mt-4 animate-slide-up-fade">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-4 h-4 rounded border-2 border-[#A8977A] bg-[#A8977A] flex items-center justify-center flex-shrink-0 mt-1 animate-fade-scale-in">
                                            <svg className="w-2.5 h-2.5 text-[#45372B]" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-sm sm:text-base lg:text-lg text-[#A8977A] leading-relaxed" style={{ fontFamily: 'Neuton, serif' }}>
                                            User‑focused layouts and typography that feel clear, consistent, and accessible.
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Web Development */}
                        <div className="border-b border-[#A8977A]/20 pb-3 sm:pb-4 transform transition-all duration-300 hover:scale-[1.02] hover:bg-[#A8977A]/5 hover:rounded-lg hover:px-4 hover:py-2">
                            <div
                                className="flex items-center justify-between cursor-pointer group"
                                onClick={() => toggleSection('webDevelopment')}
                            >
                                <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#A8977A] group-hover:text-white transition-all duration-500 group-hover:translate-x-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                                    Web Development
                                </h3>
                                <svg
                                    className={`w-4 h-4 sm:w-5 sm:h-5 text-[#A8977A] transition-all duration-500 group-hover:text-white group-hover:scale-110 ${toggleStates.webDevelopment ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {toggleStates.webDevelopment && (
                                <div className="mt-3 sm:mt-4 animate-slide-up-fade">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-4 h-4 rounded border-2 border-[#A8977A] bg-[#A8977A] flex items-center justify-center flex-shrink-0 mt-1 animate-fade-scale-in">
                                            <svg className="w-2.5 h-2.5 text-[#45372B]" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-sm sm:text-base lg:text-lg text-[#A8977A] leading-relaxed" style={{ fontFamily: 'Neuton, serif' }}>
                                            Fast, responsive builds that turn designs into reliable, scalable products.
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Brand Experience */}
                        <div className="border-b border-[#A8977A]/20 pb-3 sm:pb-4 transform transition-all duration-300 hover:scale-[1.02] hover:bg-[#A8977A]/5 hover:rounded-lg hover:px-4 hover:py-2">
                            <div
                                className="flex items-center justify-between cursor-pointer group"
                                onClick={() => toggleSection('brandExperience')}
                            >
                                <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#A8977A] group-hover:text-white transition-all duration-500 group-hover:translate-x-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                                    Brand Experience
                                </h3>
                                <svg
                                    className={`w-4 h-4 sm:w-5 sm:h-5 text-[#A8977A] transition-all duration-500 group-hover:text-white group-hover:scale-110 ${toggleStates.brandExperience ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {toggleStates.brandExperience && (
                                <div className="mt-3 sm:mt-4 animate-slide-up-fade">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-4 h-4 rounded border-2 border-[#A8977A] bg-[#A8977A] flex items-center justify-center flex-shrink-0 mt-1 animate-fade-scale-in">
                                            <svg className="w-2.5 h-2.5 text-[#45372B]" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-sm sm:text-base lg:text-lg text-[#A8977A] leading-relaxed" style={{ fontFamily: 'Neuton, serif' }}>
                                            Turning your story into visuals, interactions, and moments people remember.
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Creative Problem-Solving */}
                        <div className="border-b border-[#A8977A]/20 pb-3 sm:pb-4 transform transition-all duration-300 hover:scale-[1.02] hover:bg-[#A8977A]/5 hover:rounded-lg hover:px-4 hover:py-2">
                            <div
                                className="flex items-center justify-between cursor-pointer group"
                                onClick={() => toggleSection('creativeProblemSolving')}
                            >
                                <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#A8977A] group-hover:text-white transition-all duration-500 group-hover:translate-x-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                                    Creative Problem-Solving
                                </h3>
                                <svg
                                    className={`w-4 h-4 sm:w-5 sm:h-5 text-[#A8977A] transition-all duration-500 group-hover:text-white group-hover:scale-110 ${toggleStates.creativeProblemSolving ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {toggleStates.creativeProblemSolving && (
                                <div className="mt-3 sm:mt-4 animate-slide-up-fade">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-4 h-4 rounded border-2 border-[#A8977A] bg-[#A8977A] flex items-center justify-center flex-shrink-0 mt-1 animate-fade-scale-in">
                                            <svg className="w-2.5 h-2.5 text-[#45372B]" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-sm sm:text-base lg:text-lg text-[#A8977A] leading-relaxed" style={{ fontFamily: 'Neuton, serif' }}>
                                            Simple, smart solutions grounded in the problem – not buzzwords.
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

    // Animation utility functions
    const createIntersectionObserver = () => {
        return new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const animationType = element.dataset.animation || 'fade-scale-in';
                        const delay = element.dataset.delay || '0';

                        // Add animation class with delay
                        setTimeout(() => {
                            element.classList.add(`animate-${animationType}`);
                            element.classList.remove('animate-hidden');
                            setAnimatedElements(prev => new Set([...prev, element]));
                        }, parseInt(delay));

                        // Stop observing this element
                        observerRef.current?.unobserve(element);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
    };

    // Handle content loading after page transition
    useEffect(() => {
        if (!isTransitioning) {
            // Wait for page transition to complete, then start loading content
            const loadContentTimer = setTimeout(() => {
                setContentLoaded(true);

                // Show content immediately after loading
                const showContentTimer = setTimeout(() => {
                    setShowContent(true);
                }, 100);

                return () => clearTimeout(showContentTimer);
            }, 200); // Shorter delay after transition ends

            return () => clearTimeout(loadContentTimer);
        }
    }, [isTransitioning]);

    // Initialize Lenis smooth scroll and animations
    useEffect(() => {
        if (!showContent) return;

        // Smooth scroll to top when component mounts with animation
        const smoothScrollToTop = () => {
            const startPosition = window.pageYOffset;
            const startTime = performance.now();
            const duration = 800; // 800ms for smooth transition

            const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

            const animateScroll = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutCubic(progress);

                window.scrollTo(0, startPosition * (1 - easedProgress));

                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                }
            };

            requestAnimationFrame(animateScroll);
        };

        // Smooth scroll to top using Lenis when component mounts
        if (lenis) {
            lenis.scrollTo(0, { immediate: false, duration: 0.8 });
        }

        // Initialize Intersection Observer for animations
        observerRef.current = createIntersectionObserver();

        // Observe all elements with animation data attributes
        const animatedElements = document.querySelectorAll('[data-animation]');
        animatedElements.forEach(el => {
            el.classList.add('animate-hidden');
            observerRef.current?.observe(el);
        });

        // Handle scroll to detect which section is in view (desktop only)
        const handleScroll = (e) => {
            // Only apply scroll-based image switching on larger screens
            if (window.innerWidth >= 1024) {
                const sections = document.querySelectorAll('.content-section');
                const scrollPosition = e.scroll + window.innerHeight / 2;

                sections.forEach((section, index) => {
                    const sectionTop = section.offsetTop;
                    const sectionBottom = sectionTop + section.offsetHeight;

                    if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                        setActiveSection(index);
                    }
                });
            }
        };

        // Listen to Lenis scroll events
        if (lenis) {
            lenis.on('scroll', handleScroll);
        }

        // Cleanup
        return () => {
            if (lenis) {
                lenis.off('scroll', handleScroll);
            }
            observerRef.current?.disconnect();
        };
    }, [showContent, lenis]);

    return (
        <div className="min-h-screen relative z-10" style={{ backgroundColor: '#45372B' }}>
            {/* Show content with smooth slide-in animation */}
            {contentLoaded && (
                <div className={`${showContent ? 'animate-slide-in-bottom' : 'opacity-0 translate-y-12'}`}>
                    {/* Fixed Navbar with proper z-index */}
                    <div className="fixed top-0 left-0 right-0 z-50">
                        <div className={`${showContent ? 'animate-slide-in-stagger delay-200' : 'opacity-0'}`} style={{ pointerEvents: showContent ? 'auto' : 'none' }}>
                            <Navbar />
                        </div>
                    </div>
                    
                    {/* Main content with proper top spacing */}
                    <div className={`text-[#A8977A] px-4 sm:px-8 lg:px-16 py-6 pt-24 sm:pt-28 lg:pt-32 relative z-0 ${showContent ? 'animate-slide-in-stagger delay-400' : 'opacity-0'}`}>
                        <div className="w-full max-w-6xl mx-auto">

                            {/* Main content */}
                            <div className="space-y-12 sm:space-y-16 lg:space-y-40">
                                {/* Split Screen Content Section */}
                                <section className="px-0 sm:px-2 lg:px-4">
                                    <div className="w-full max-w-6xl mx-auto">
                                        {/* Enhanced Mobile Image - Shows on small screens at the top */}
                                        <div className="block lg:hidden mb-8 sm:mb-12 pt-12" data-animation="slide-up-fade" data-delay="300">
                                            <div className="relative w-full h-[50vh] sm:h-[50vh] rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-700 hover:scale-105 hover:shadow-3xl">
                                                <img
                                                    src={contentSections[0].image}
                                                    alt={contentSections[0].alt}
                                                    className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                                {/* Subtle border glow */}
                                                <div className="absolute inset-0 rounded-2xl border-2 border-[#A8977A]/20 hover:border-[#A8977A]/40 transition-all duration-500"></div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-[50%_35%] gap-8 lg:gap-[15%] min-h-screen">
                                            {/* Left Side - Scrollable Text Content */}
                                            <div className="space-y-16 sm:space-y-24 lg:space-y-60">
                                                {contentSections.map((section, index) => (
                                                    <div
                                                        key={section.id}
                                                        className={`content-section min-h-[52vh] sm:min-h-[50vh] lg:min-h-[60vh] flex ${index === 0
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

                                            {/* Right Side - Enhanced Fixed Image Container (hidden on mobile, shown on desktop) */}
                                            <div className="hidden lg:block lg:sticky lg:top-48 lg:w-[40vh] lg:h-[60vh] group">
                                                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-700 hover:scale-105 hover:shadow-3xl hover:-translate-y-2">
                                                    {/* Background blur effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-[#A8977A]/20 to-transparent backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

                                                    {contentSections.map((section, index) => (
                                                        <div
                                                            key={section.id}
                                                            className={`absolute inset-0 transition-all duration-1000 ease-out ${activeSection === index
                                                                ? 'opacity-100 scale-100 rotate-0'
                                                                : 'opacity-0 scale-110 rotate-1'
                                                                }`}
                                                        >
                                                            <img
                                                                src={section.image}
                                                                alt={section.alt}
                                                                className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
                                                                style={{
                                                                    filter: activeSection === index ? 'brightness(1) contrast(1.05)' : 'brightness(0.8) contrast(0.9)'
                                                                }}
                                                            />
                                                            {/* Animated overlay */}
                                                            <div className={`absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent transition-opacity duration-1000 ${activeSection === index ? 'opacity-100' : 'opacity-60'
                                                                }`}></div>
                                                        </div>
                                                    ))}

                                                    {/* Floating particles effect */}
                                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                                                        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#A8977A]/40 rounded-full animate-pulse"></div>
                                                        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-[#A8977A]/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                                                        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-[#A8977A]/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                                                    </div>

                                                    {/* Border glow effect */}
                                                    <div className="absolute inset-0 rounded-2xl border-2 border-[#A8977A]/0 group-hover:border-[#A8977A]/30 transition-all duration-700"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Design with Strategy and Creativity Section */}
                                <section className="px-0 sm:px-2 lg:px-4 py-8 sm:py-16 lg:py-24">
                                    <div className="w-full max-w-6xl mx-auto">
                                        <h2
                                            className="text-2xl sm:text-3xl lg:text-5xl font-light text-[#A8977A] mb-6 sm:mb-8 lg:mb-12"
                                            data-animation="fade-scale-in"
                                            data-delay="0"
                                        >
                                            Design with Strategy and Creativity
                                        </h2>
                                        <p
                                            className="text-base sm:text-lg lg:text-xl text-[#A8977A] leading-relaxed max-w-2xl mb-8 sm:mb-12 lg:mb-20"
                                            data-animation="slide-up-fade"
                                            data-delay="200"
                                            style={{ fontFamily: 'Neuton, serif' }}
                                        >
                                            Every great digital experience starts with understanding the why behind the what. I combine strategic thinking with creative execution to build solutions that not only look exceptional but solve real problems for real people.
                                        </p>

                                        {/* Container Grid - Responsive */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-7">
                                            {/* Process Step 01 */}
                                            <div
                                                className="bg-[#64BBD8] border border-[#A8977A]/20 rounded-2xl p-6 sm:p-8 h-80 sm:h-96 flex flex-col justify-between transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2"
                                                data-animation="fade-scale-in"
                                                data-delay="400"
                                            >
                                                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#161711] self-start transition-transform duration-300 hover:scale-110" style={{ fontFamily: 'Syne, sans-serif' }}>01.</h2>
                                                <div className="self-start">
                                                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#161711] mb-2 sm:mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Research & Strategy</h3>
                                                    <p className="text-sm sm:text-base lg:text-lg text-[#161711]/80 leading-relaxed" style={{ fontFamily: 'Neuton, serif' }}>
                                                        In this phase, I dive deep into understanding your business, target audience, and project goals. Through research and strategic planning, I create a clear roadmap to guide the entire design process.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Image 1 */}
                                            <div
                                                className="bg-[#A8977A]/10 border border-[#A8977A]/20 rounded-2xl h-80 sm:h-96 flex items-center justify-center overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2"
                                                data-animation="fade-scale-in"
                                                data-delay="500"
                                            >
                                                <img src="https://picsum.photos/seed/research/300/300" alt="Research process" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                                            </div>

                                            {/* Process Step 02 */}
                                            <div
                                                className="bg-[#161711] border border-[#A8977A]/20 rounded-2xl p-6 sm:p-8 h-80 sm:h-96 flex flex-col justify-between transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2"
                                                data-animation="fade-scale-in"
                                                data-delay="600"
                                            >
                                                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#A8977A] self-start transition-transform duration-300 hover:scale-110" style={{ fontFamily: 'Syne, sans-serif' }}>02.</h2>
                                                <div className="self-start">
                                                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#A8977A] mb-2 sm:mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Concept & Ideation</h3>
                                                    <p className="text-sm sm:text-base lg:text-lg text-[#A8977A]/80 leading-relaxed" style={{ fontFamily: 'Neuton, serif' }}>
                                                        Here, I brainstorm and develop creative concepts that align with your vision. Initial sketches and ideas are refined into tangible wireframes, setting the direction for design and functionality.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Image 2 */}
                                            <div
                                                className="bg-[#A8977A]/10 border border-[#A8977A]/20 rounded-2xl h-80 sm:h-96 flex items-center justify-center overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2"
                                                data-animation="fade-scale-in"
                                                data-delay="700"
                                            >
                                                <img src="https://picsum.photos/seed/ideation/300/300" alt="Ideation process" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                                            </div>

                                            {/* Process Step 03 - Spans 2 columns on larger screens */}
                                            <div
                                                className="md:col-span-2 bg-[#A8977A] border border-[#A8977A]/20 rounded-2xl p-6 sm:p-8 h-80 sm:h-96 flex flex-col justify-between transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2"
                                                data-animation="fade-scale-in"
                                                data-delay="800"
                                            >
                                                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#45372B] self-start transition-transform duration-300 hover:scale-110" style={{ fontFamily: 'Syne, sans-serif' }}>03.</h2>
                                                <div className="self-start max-w-2xl">
                                                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#45372B] mb-2 sm:mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Feedback & Refinement</h3>
                                                    <p className="text-sm sm:text-base lg:text-lg text-[#45372B] leading-relaxed" style={{ fontFamily: 'Neuton, serif' }}>
                                                        Collaboration is key. I review the design with you, gather feedback, and refine the work to align with your expectations and goals. This ensures the design reflects your vision.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Process Step 04 */}
                                            <div
                                                className="bg-[#161711] border border-[#A8977A]/20 rounded-2xl p-6 sm:p-8 h-80 sm:h-96 flex flex-col justify-between transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2"
                                                data-animation="fade-scale-in"
                                                data-delay="900"
                                            >
                                                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#A8977A] self-start transition-transform duration-300 hover:scale-110" style={{ fontFamily: 'Syne, sans-serif' }}>04.</h2>
                                                <div className="self-start">
                                                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#A8977A] mb-2 sm:mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Testing & Optimization</h3>
                                                    <p className="text-sm sm:text-base lg:text-lg text-[#A8977A]/80 leading-relaxed" style={{ fontFamily: 'Neuton, serif' }}>
                                                        I conduct thorough testing to identify and resolve any performance or usability issues. This phase ensures the design works seamlessly across devices and meets user experience standards.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Image 3 */}
                                            <div
                                                className="bg-[#A8977A]/10 border border-[#A8977A]/20 rounded-2xl h-80 sm:h-96 flex items-center justify-center overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2"
                                                data-animation="fade-scale-in"
                                                data-delay="1000"
                                            >
                                                <img src="https://picsum.photos/seed/testing/300/300" alt="Testing process" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                                            </div>

                                            {/* Process Step 05 */}
                                            <div
                                                className="bg-[#64BBD8] border border-[#A8977A]/20 rounded-2xl p-6 sm:p-8 h-80 sm:h-96 flex flex-col justify-between transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2"
                                                data-animation="fade-scale-in"
                                                data-delay="1100"
                                            >
                                                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#161711] self-start transition-transform duration-300 hover:scale-110" style={{ fontFamily: 'Syne, sans-serif' }}>05.</h2>
                                                <div className="self-start">
                                                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#161711] mb-2 sm:mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Launch & Delivery</h3>
                                                    <p className="text-sm sm:text-base lg:text-lg text-[#161711]/80 leading-relaxed" style={{ fontFamily: 'Neuton, serif' }}>
                                                        Once everything is finalized, the project is launched and delivered to you. I also provide guidance or support for ongoing maintenance to ensure long-term success.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* When I'm not working Section */}
                                <section className="px-0 sm:px-2 lg:px-4 py-8 sm:py-16 lg:py-24">
                                    <div className="w-full max-w-6xl mx-auto">
                                        <h2
                                            className="text-2xl sm:text-3xl lg:text-5xl font-light text-[#A8977A] mb-6 sm:mb-8 lg:mb-12"
                                            data-animation="fade-scale-in"
                                            data-delay="0"
                                        >
                                            When I'm Not Working
                                        </h2>
                                        <p
                                            className="text-base sm:text-lg lg:text-xl text-[#A8977A] leading-relaxed max-w-2xl mb-8 sm:mb-12 lg:mb-20"
                                            data-animation="slide-up-fade"
                                            data-delay="200"
                                            style={{ fontFamily: 'Neuton, serif' }}
                                        >
                                            When I'm not building or designing, you'll probably find me with a good book and freshly brewed coffee, cheering for my favorite football team, experimenting with new recipes in the kitchen, or curled up with my dog for a cozy movie night.
                                        </p>

                                        <div
                                            data-animation="fade-scale-in"
                                            data-delay="400"
                                        >
                                            <ScrollingGallery />
                                        </div>
                                    </div>
                                </section>

                                {/* Contact Form Section */}
                                <section className="px-0 sm:px-2 lg:px-4 py-8 sm:py-16 lg:py-24">
                                    <div className="w-full max-w-6xl mx-auto">
                                        <div className="grid grid-cols-1 lg:grid-cols-[50%_35%] gap-8 lg:gap-[15%]">
                                            {/* Left Side - Contact Form */}
                                            <div>
                                                <h2
                                                    className="text-2xl sm:text-3xl lg:text-5xl font-light text-[#A8977A] mb-6 sm:mb-8 lg:mb-12"
                                                    data-animation="fade-scale-in"
                                                    data-delay="0"
                                                >
                                                    Let's Work Together
                                                </h2>
                                                <p
                                                    className="text-base sm:text-lg lg:text-xl text-[#A8977A] leading-relaxed mb-8 sm:mb-12 lg:mb-16"
                                                    data-animation="slide-up-fade"
                                                    data-delay="200"
                                                    style={{ fontFamily: 'Neuton, serif' }}
                                                >
                                                    Let's build something impactful together—whether it's your brand, your website, or your next big idea.
                                                </p>

                                                {showThankYou ? (
                                                    /* Thank You Message */
                                                    <div className="bg-[#64BBD8] border border-[#A8977A]/20 rounded-2xl p-6 sm:p-8">
                                                        <div className="text-center">
                                                            {/* Success Icon */}
                                                            <div className="mx-auto mb-6 w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                                                                <svg
                                                                    className="w-8 h-8 text-blue-900"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M5 13l4 4L19 7"
                                                                    />
                                                                </svg>
                                                            </div>

                                                            <h3 className="text-2xl font-bold text-[#161711] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>Thank You!</h3>

                                                            <p className="text-[#161711]/80 mb-6 leading-relaxed" style={{ fontFamily: 'Neuton, serif' }}>
                                                                Your message has been sent successfully. I'll get back to you as soon as possible!
                                                            </p>

                                                            <div className="bg-[#BAE1EE] border border-[#161711]/30 rounded-lg p-4 mb-6">
                                                                <div className="flex items-start">
                                                                    <svg
                                                                        className="w-5 h-5 text-[#161711] mt-0.5 mr-3 flex-shrink-0"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                                        />
                                                                    </svg>
                                                                    <div className="text-left">
                                                                        <p className="text-sm font-medium text-[#161711] mb-1" style={{ fontFamily: 'Neuton, serif' }}>
                                                                            Check your email
                                                                        </p>
                                                                        <p className="text-sm text-[#161711]/90" style={{ fontFamily: 'Neuton, serif' }}>
                                                                            You'll receive a confirmation email shortly with details about next steps.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <button
                                                                onClick={handleBackToForm}
                                                                className="bg-[#BAE1EE] text-[#161711] py-3 px-6 rounded-lg hover:bg-[#9a8a6d] transition-colors duration-200 font-medium"
                                                            >
                                                                <span style={{ fontFamily: 'Neuton, serif' }}>Send Another Message</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* Contact Form */
                                                    <div
                                                        className="bg-transparent"
                                                        data-animation="slide-up-fade"
                                                        data-delay="400"
                                                    >
                                                        {submitStatus === 'error' && (
                                                            <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 animate-slide-up-fade">
                                                                Failed to send message. Please try again.
                                                            </div>
                                                        )}

                                                        <form onSubmit={handleSubmit} className="space-y-6">
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                                                <div>
                                                                    <label htmlFor="name" className="block text-sm font-medium text-[#A8977A] mb-2" style={{ fontFamily: 'Neuton, serif' }}>
                                                                        Name
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        id="name"
                                                                        name="name"
                                                                        value={formData.name}
                                                                        onChange={handleInputChange}
                                                                        required
                                                                        className="w-full px-4 py-3 bg-transparent border border-[#A8977A]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8977A] focus:border-transparent text-[#A8977A] placeholder-[#A8977A]/50 transition-all duration-300 hover:border-[#A8977A]/60 hover:shadow-lg focus:scale-[1.02]"
                                                                        placeholder="Your name"
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <label htmlFor="email" className="block text-sm font-medium text-[#A8977A] mb-2" style={{ fontFamily: 'Neuton, serif' }}>
                                                                        Email
                                                                    </label>
                                                                    <input
                                                                        type="email"
                                                                        id="email"
                                                                        name="email"
                                                                        value={formData.email}
                                                                        onChange={handleInputChange}
                                                                        required
                                                                        className="w-full px-4 py-3 bg-transparent border border-[#A8977A]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8977A] focus:border-transparent text-[#A8977A] placeholder-[#A8977A]/50 transition-all duration-300 hover:border-[#A8977A]/60 hover:shadow-lg focus:scale-[1.02]"
                                                                        placeholder="your.email@example.com"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <label htmlFor="message" className="block text-sm font-medium text-[#A8977A] mb-2" style={{ fontFamily: 'Neuton, serif' }}>
                                                                    Message
                                                                </label>
                                                                <textarea
                                                                    id="message"
                                                                    name="message"
                                                                    value={formData.message}
                                                                    onChange={handleInputChange}
                                                                    required
                                                                    rows="5"
                                                                    className="w-full px-4 py-3 bg-transparent border border-[#A8977A]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8977A] focus:border-transparent text-[#A8977A] placeholder-[#A8977A]/50 resize-none transition-all duration-300 hover:border-[#A8977A]/60 hover:shadow-lg focus:scale-[1.02]"
                                                                    placeholder="Tell me about your project..."
                                                                />
                                                            </div>

                                                            <button
                                                                type="submit"
                                                                disabled={isSubmitting}
                                                                className="w-full bg-[#A8977A] text-[#45372B] py-3 px-6 rounded-lg hover:bg-[#9a8a6d] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium hover:scale-105 hover:shadow-xl transform active:scale-95"
                                                            >
                                                                <span style={{ fontFamily: 'Neuton, serif' }}>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                                                            </button>
                                                        </form>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right Side - Fixed Image Container */}
                                            <div className="hidden lg:block lg:sticky lg:top-48 lg:w-[40vh] lg:h-[60vh]">
                                                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg">
                                                    <img
                                                        src="https://picsum.photos/seed/contact/600/800"
                                                        alt="Let's work together"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/10"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
            )}
        </div>
    );
}

export default AboutPage;