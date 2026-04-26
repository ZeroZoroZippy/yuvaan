import React, { useEffect, useRef } from 'react';
import OptimizedImage from '../OptimizedImage';
import G1 from '../../assets/Gallery/G1.JPG'
import G3 from '../../assets/Gallery/G3.JPG'
import G5 from '../../assets/Gallery/G5.jpg'
import G6 from '../../assets/Gallery/G6.jpg'
import G8 from '../../assets/Gallery/G8.JPG'
import G9 from '../../assets/Gallery/G9.jpg'

const GALLERY_ITEMS = [
    { id: 1, image: G1, alt: "Adorable golden retriever puppy playing outdoors in natural setting, reflecting Yuvaan Vithlani's love for animals and life outside digital product work"},
    { id: 2, image: G8, alt: "Yuvaan Vithlani's workspace featuring dual monitors, notes, and tools used for product thinking, client work, and AI experiments"},
    { id: 3, image: G3, alt: "Yuvaan Vithlani enjoying outdoor adventure and hiking, demonstrating healthy work-life balance and active lifestyle that inspires his user-centered design approach" },
    { id: 4, image: G5, alt: "Lucy, Yuvaan Vithlani's beloved golden retriever, relaxing comfortably at home in peaceful environment", label: "Lucy" },
    { id: 5, image: G6, alt: "Lara, Yuvaan Vithlani's cherished pet, reflecting the empathy and steadiness that shape how he approaches products and people", label: "Lara" },
    { id: 6, image: G9, alt: "Yuvaan Vithlani in a candid moment showing the thoughtful and approachable personality behind his product, client, and AI work" }
];

function ScrollingGallery() {
    const scrollRef = useRef(null);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        // Calculate exact dimensions for smooth animation
        const calculateDimensions = () => {
            const screenWidth = window.innerWidth;
            
            // Match your Tailwind breakpoints exactly
            let itemWidth, gap;
            if (screenWidth >= 1024) { // lg
                itemWidth = 256; // w-64
                gap = 24; // space-x-6
            } else if (screenWidth >= 640) { // sm
                itemWidth = 224; // w-56
                gap = 24; // space-x-6
            } else {
                itemWidth = 192; // w-48
                gap = 16; // space-x-4
            }
            
            return { itemWidth, gap };
        };

        const { itemWidth, gap } = calculateDimensions();
        const singleSetWidth = (itemWidth + gap) * GALLERY_ITEMS.length - gap; // Subtract last gap
        
        // Create and inject proper CSS animation
        const styleId = 'scroll-gallery-animation';
        let existingStyle = document.getElementById(styleId);
        
        if (existingStyle) {
            existingStyle.remove();
        }
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            @keyframes scroll-gallery {
                0% { transform: translateX(0); }
                100% { transform: translateX(-${singleSetWidth}px); }
            }
            
            .scroll-animation {
                animation: scroll-gallery 25s linear infinite;
                will-change: transform;
            }
            
            .scroll-animation:hover {
                animation-play-state: paused;
            }
        `;
        
        document.head.appendChild(style);
        
        // Apply the animation class
        scrollContainer.classList.add('scroll-animation');
        
        // Cleanup function
        return () => {
            const styleToRemove = document.getElementById(styleId);
            if (styleToRemove) {
                styleToRemove.remove();
            }
            if (scrollContainer) {
                scrollContainer.classList.remove('scroll-animation');
            }
        };
    }, []);

    return (
        <section className="w-full overflow-hidden">
            <div className="w-full overflow-hidden">
                <div 
                    ref={scrollRef}
                    className="flex space-x-4 sm:space-x-6" 
                    style={{ width: 'fit-content' }}
                >
                    {/* First set of images */}
                    <div className="flex space-x-4 sm:space-x-6 shrink-0">
                        {GALLERY_ITEMS.map((item) => (
                            <div key={`first-${item.id}`} className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-2xl overflow-hidden shadow-lg relative group">
                                <OptimizedImage
                                    src={item.image}
                                    alt={item.alt}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    lazy={true}
                                />
                                {item.label && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 sm:p-4">
                                        <p className="text-white font-medium text-sm sm:text-base" style={{ fontFamily: 'var(--font-sans)' }}>{item.label}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {/* Duplicate set for seamless loop */}
                    <div className="flex space-x-4 sm:space-x-6 shrink-0">
                        {GALLERY_ITEMS.map((item) => (
                            <div key={`second-${item.id}`} className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-2xl overflow-hidden shadow-lg relative group">
                                <OptimizedImage
                                    src={item.image}
                                    alt={item.alt}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    lazy={true}
                                />
                                {item.label && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 sm:p-4">
                                        <p className="text-white font-medium text-sm sm:text-base" style={{ fontFamily: 'var(--font-sans)' }}>{item.label}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ScrollingGallery;
