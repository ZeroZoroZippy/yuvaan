import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import saarth from '../assets/Projects/Saarth.png'
import wellness from '../assets/Projects/mental-wellness.png'
import dental from '../assets/Projects/Dental.png'

function Projects() {
  const [toggleStates, setToggleStates] = useState({
    project1: false,
    project2: false,
    project3: false
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const projectImages = [saarth, dental, wellness];

  const scrollContainerRef = useRef(null);
  const project1Ref = useRef(null);
  const project2Ref = useRef(null);
  const project3Ref = useRef(null);

  // Check if any project is open
  const isAnyProjectOpen = Object.values(toggleStates).some(state => state);

  // Autoplay carousel for project images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % projectImages.length
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [projectImages.length]);

  // Reset scroll position when all projects are closed
  useEffect(() => {
    if (scrollContainerRef.current) {
      if (!isAnyProjectOpen) {
        // Reset scroll to top when all projects are closed
        setTimeout(() => {
          scrollContainerRef.current.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }, 300); // Wait for collapse animation to start

        // Then hide overflow after scroll completes
        setTimeout(() => {
          scrollContainerRef.current.style.overflowY = 'hidden';
        }, 600);
      } else {
        // Enable scroll when any project is open
        scrollContainerRef.current.style.overflowY = 'auto';
      }
    }
  }, [isAnyProjectOpen]);

  const handleToggle = (projectKey) => {
    const isOpening = !toggleStates[projectKey];

    // If closing the last open project, prepare for reset
    const updatedStates = {
      ...toggleStates,
      [projectKey]: isOpening
    };

    setToggleStates(updatedStates);

    // Auto-scroll only when opening a project
    if (isOpening) {
      // First ensure scroll is enabled
      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.overflowY = 'auto';
      }

      setTimeout(() => {
        const projectRefs = {
          project1: project1Ref,
          project2: project2Ref,
          project3: project3Ref
        };

        const targetRef = projectRefs[projectKey];

        if (targetRef?.current && scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const target = targetRef.current;
          const containerRect = container.getBoundingClientRect();
          const targetRect = target.getBoundingClientRect();

          // Calculate optimal scroll position
          const scrollTop = container.scrollTop + targetRect.top - containerRect.top - 20;

          // Smooth scroll with easing
          container.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  const expandVariants = {
    hidden: {
      height: 0,
      opacity: 0,
      scale: 0.95
    },
    visible: {
      height: "auto",
      opacity: 1,
      scale: 1,
      transition: {
        height: {
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94]
        },
        opacity: {
          duration: 0.4,
          delay: 0.15,
          ease: "easeOut"
        },
        scale: {
          duration: 0.5,
          delay: 0.1,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }
    },
    exit: {
      height: 0,
      opacity: 0,
      scale: 0.95,
      transition: {
        height: {
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.1
        },
        opacity: {
          duration: 0.3,
          ease: "easeIn"
        },
        scale: {
          duration: 0.3,
          ease: "easeIn"
        }
      }
    }
  };

  // Project data for cleaner code
  const projects = [
    { key: 'project1', title: 'Saarth - AI Companion', ref: project1Ref, image: saarth },
    { key: 'project2', title: 'Dental Website', ref: project2Ref, image: dental },
    { key: 'project3', title: 'Wellness Website', ref: project3Ref, image: wellness }
  ];

  return (
    <div
      className="rounded-2xl shadow-lg w-full lg:w-[465px] h-auto lg:h-[630px] overflow-hidden"
      style={{ backgroundColor: '#161711' }}
    >
      {/* Sidebar Container - Projects */}
      <div
        className="p-4 lg:p-6 h-full"
        ref={scrollContainerRef}
        style={{
          overflowY: 'hidden', // Start with hidden
          scrollBehavior: 'smooth'
        }}
      >
        <h2 className="text-3xl font-bold mb-4 text-[#A8977A]">Projects</h2>

        {/* Image Container with Autoplay Carousel */}
        <div className="mb-6 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={projectImages[currentImageIndex]}
              alt={`Project ${currentImageIndex + 1}`}
              className="w-full h-32 lg:h-64 object-cover"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </AnimatePresence>

          {/* Carousel Indicators */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {projectImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex
                  ? 'bg-[#A8977A] scale-125'
                  : 'bg-white/50 hover:bg-white/75'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4 pb-20">
          {projects.map((project) => (
            <div key={project.key} className="p-3 lg:p-4 rounded-lg" ref={project.ref}>
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-[#A8977A]" style={{ fontSize: '1.25rem' }}>
                  {project.title}
                </h3>
                <button
                  onClick={() => handleToggle(project.key)}
                  className="text-[#A8977A] hover:text-[#45372B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#A8977A] focus:ring-opacity-50 rounded"
                  aria-label={`Toggle ${project.title}`}
                  aria-expanded={toggleStates[project.key]}
                >
                  <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: toggleStates[project.key] ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>
              </div>
              <AnimatePresence>
                {toggleStates[project.key] && (
                  <motion.div
                    variants={expandVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="overflow-hidden will-change-transform"
                    style={{ transformOrigin: 'top' }}
                  >
                    <div className="mt-3">
                      <div className="relative rounded-2xl overflow-hidden bg-gray-100">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-56 object-cover"
                        />
                        <button className="absolute bottom-3 right-3 bg-[#A8977A] text-[#161711] px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-[#45372B] hover:text-[#A8977A] transition-colors shadow-lg">
                          View More
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="w-full h-px bg-[#45372B] mt-3"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Projects;