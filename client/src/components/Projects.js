import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalytics } from '../hooks/useAnalytics';
import wellness from '../assets/Projects/mental-wellness.jpg'
import dental from '../assets/Projects/Dental.jpg'

function Projects() {
  const { trackProject, trackCTA } = useAnalytics();
  const [toggleStates, setToggleStates] = useState({
    project1: true,  // First project open by default
    project2: false
  });

  const scrollContainerRef = useRef(null);
  const project1Ref = useRef(null);
  const project2Ref = useRef(null);

  // Check if any project is open
  const isAnyProjectOpen = Object.values(toggleStates).some(state => state);



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

  const handleOpenProject = (projectKey) => {
    const isCurrentlyOpen = toggleStates[projectKey];

    // If already open, do nothing
    if (isCurrentlyOpen) {
      return;
    }

    // Track project expansion
    const projectNames = {
      project1: 'Sarvodaya Dental Clinic',
      project2: 'Therapy With Aakanksha'
    };
    
    trackProject(projectNames[projectKey], projectKey, 'expand');
    trackCTA(`project_${projectKey}_expand`, 'project_interaction', {
      projectName: projectNames[projectKey],
      action: 'expand',
      currentPage: window.location.pathname
    });

    // Close all others and open the clicked one
    const updatedStates = {
      project1: projectKey === 'project1',
      project2: projectKey === 'project2'
    };

    setToggleStates(updatedStates);

    // Auto-scroll when opening a project
    // First ensure scroll is enabled
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.overflowY = 'auto';
    }

    setTimeout(() => {
      const projectRefs = {
        project1: project1Ref,
        project2: project2Ref
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
  };

  const handleCloseProject = (projectKey) => {
    const projectNames = {
      project1: 'Sarvodaya Dental Clinic',
      project2: 'Therapy With Aakanksha'
    };
    
    trackProject(projectNames[projectKey], projectKey, 'collapse');
    trackCTA(`project_${projectKey}_close`, 'project_interaction', {
      projectName: projectNames[projectKey],
      action: 'collapse',
      currentPage: window.location.pathname
    });
    
    setToggleStates({
      project1: false,
      project2: false
    });
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
    { key: 'project1', title: 'Sarvodaya Dental Clinic', ref: project1Ref, image: dental },
    { key: 'project2', title: 'Therapy With Aakanksha', ref: project2Ref, image: wellness }
  ];

  return (
    <div
      className="rounded-2xl shadow-lg w-full lg:w-[465px] h-[600px] lg:h-[630px] overflow-hidden"
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
        <h2 className="text-3xl font-bold mb-4 text-[#A8977A]" style={{ fontFamily: 'Bubblegum Sans, sans-serif' }}>Work</h2>



        <div className="space-y-4 pb-20">
          {projects.map((project) => (
            <div key={project.key} className="p-3 lg:p-4 rounded-lg" ref={project.ref}>
              <div className="flex justify-between items-center">
                <h3
                  className="font-semibold text-[#A8977A] cursor-pointer hover:text-[#45372B] transition-colors"
                  style={{ fontSize: '1.25rem', fontFamily: 'Bubblegum Sans, sans-serif' }}
                  onClick={() => handleOpenProject(project.key)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOpenProject(project.key);
                    }
                  }}
                  aria-expanded={toggleStates[project.key]}
                >
                  {project.title}
                </h3>
                {toggleStates[project.key] && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="cursor-pointer"
                    onClick={(e) => {
                      if (project.key === 'project1') {
                        // For Dental Website, open the live site
                        e.preventDefault();
                        trackProject('Sarvodaya Dental Clinic', 'project1', 'external_link');
                        trackCTA('project_dental_external_link', 'external_link', {
                          projectName: 'Sarvodaya Dental Clinic',
                          destination: 'https://www.sarvodayadental.com/',
                          currentPage: window.location.pathname
                        });
                        window.open('https://www.sarvodayadental.com/', '_blank');
                      } else if (project.key === 'project2') {
                        // For Wellness Website, open the live site
                        e.preventDefault();
                        trackProject('Therapy With Aakanksha', 'project2', 'external_link');
                        trackCTA('project_wellness_external_link', 'external_link', {
                          projectName: 'Therapy With Aakanksha',
                          destination: 'https://therapy-with-aakanksha.vercel.app/',
                          currentPage: window.location.pathname
                        });
                        window.open('https://therapy-with-aakanksha.vercel.app/', '_blank');
                      } else {
                        // For other projects, close the project
                        handleCloseProject(project.key);
                      }
                    }}
                  >
                    <svg
                      className="w-6 h-6 text-[#A8977A] transition-transform duration-300 ease-in-out hover:scale-110 hover:text-[#45372B]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M7 17L17 7M17 7H7M17 7V17"
                      />
                    </svg>
                  </motion.div>
                )}
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