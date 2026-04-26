import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalytics } from '../hooks/useAnalytics';
import { usePageNavigation } from '../hooks/usePageNavigation';
import OptimizedImage from './OptimizedImage';
import { getFeaturedProjects } from '../data/projectsData';

function Projects() {
  const { trackProject, trackCTA } = useAnalytics();
  const { navigateWithTransition } = usePageNavigation();
  const projects = getFeaturedProjects();
  const [openProjectId, setOpenProjectId] = useState(projects[0]?.id || null);
  const scrollContainerRef = useRef(null);
  const projectRefs = useRef({});

  useEffect(() => {
    if (!openProjectId || !scrollContainerRef.current) {
      return;
    }

    const target = projectRefs.current[openProjectId];
    if (!target) {
      return;
    }

    setTimeout(() => {
      const container = scrollContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const scrollTop = container.scrollTop + targetRect.top - containerRect.top - 20;

      container.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }, 100);
  }, [openProjectId]);

  const handleToggleProject = (project) => {
    const isCurrentlyOpen = openProjectId === project.id;

    trackProject(project.title, project.id, isCurrentlyOpen ? 'collapse' : 'expand');
    trackCTA(`project_${project.id}_${isCurrentlyOpen ? 'collapse' : 'expand'}`, 'project_interaction', {
      projectName: project.title,
      action: isCurrentlyOpen ? 'collapse' : 'expand',
      currentPage: window.location.pathname
    });

    setOpenProjectId(isCurrentlyOpen ? null : project.id);
  };

  const handleVisitProject = (project) => {
    trackProject(project.title, project.id, 'case_study_open');
    trackCTA(`project_${project.id}_case_study`, 'internal_navigation', {
      projectName: project.title,
      destination: `/projects/${project.id}`,
      currentPage: window.location.pathname
    });

    navigateWithTransition(`/projects/${project.id}`, 'up');
  };

  const expandVariants = {
    hidden: {
      height: 0,
      opacity: 0,
      scale: 0.95
    },
    visible: {
      height: 'auto',
      opacity: 1,
      scale: 1,
      transition: {
        height: {
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94]
        },
        opacity: {
          duration: 0.4,
          delay: 0.12,
          ease: 'easeOut'
        },
        scale: {
          duration: 0.45,
          delay: 0.08,
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
          duration: 0.35,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.08
        },
        opacity: {
          duration: 0.25,
          ease: 'easeIn'
        },
        scale: {
          duration: 0.25,
          ease: 'easeIn'
        }
      }
    }
  };

  return (
    <section
      className="rounded-2xl shadow-lg w-full lg:w-[465px] h-[600px] lg:h-[630px] overflow-hidden"
      style={{ backgroundColor: '#161711' }}
      aria-labelledby="projects-heading"
    >
      <div className="p-4 lg:p-6 h-full flex flex-col">
        <h2 id="projects-heading" className="text-3xl font-bold mb-4 text-[#A8977A]" style={{ fontFamily: 'var(--font-sans)' }}>
          Work
        </h2>

        <div
          ref={scrollContainerRef}
          data-lenis-prevent
          className="flex-1 min-h-0 space-y-4 pb-20 overflow-y-auto"
          style={{
            scrollBehavior: 'smooth',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {projects.map((project) => {
            const isOpen = openProjectId === project.id;

            return (
              <div
                key={project.id}
                className="p-3 lg:p-4 rounded-lg"
                ref={(node) => {
                  projectRefs.current[project.id] = node;
                }}
              >
                <div className="flex justify-between items-center gap-4">
                  <h3
                    className="font-semibold text-[#A8977A]"
                    style={{ fontSize: '1.25rem', fontFamily: 'var(--font-sans)' }}
                  >
                    <button
                      type="button"
                      className="cursor-pointer hover:text-[#45372B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#A8977A] focus:ring-offset-2 focus:ring-offset-[#161711] rounded-md px-2 py-1 text-left"
                      style={{ fontFamily: 'var(--font-sans)' }}
                      onClick={() => handleToggleProject(project)}
                      aria-expanded={isOpen}
                      aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${project.title} project details`}
                    >
                      {project.title}
                    </button>
                  </h3>

                  <button
                    type="button"
                    className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#A8977A] focus:ring-offset-2 focus:ring-offset-[#161711] rounded-md p-1"
                    aria-label={`Open ${project.title} case study`}
                    onClick={() => handleVisitProject(project)}
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
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      variants={expandVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="overflow-hidden will-change-transform"
                      style={{ transformOrigin: 'top' }}
                    >
                      <div className="mt-3 space-y-3">
                        <div className="inline-flex items-center rounded-full border border-[#A8977A]/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#A8977A]/80">
                          {project.category}
                        </div>

                        <p
                          className="text-base text-[#A8977A] leading-relaxed"
                          style={{ fontFamily: 'var(--font-sans)' }}
                        >
                          {project.summary}
                        </p>

                        <div className="relative rounded-2xl overflow-hidden bg-gray-100">
                          <OptimizedImage
                            src={project.image}
                            alt={project.imageAlt}
                            className="w-full h-56 object-cover"
                            lazy={true}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="w-full h-px bg-[#45372B] mt-3"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Projects;
