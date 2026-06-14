import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { getProjectById, getAllProjects } from '../data/projectsData'; // Import the data
import MetaManager from '../components/SEO/MetaManager';
import { getMetaConfig } from '../config/metaConfigs';

function ProjectPage() {
  const { projectId } = useParams();

  // Get project data from our optimized structure
  const project = getProjectById(projectId);
  const allProjects = getAllProjects();
  const isBrandintelleProject = project?.id === 'brandintelle';
  const isScreenshotProject = project?.id === 'geothesis';

  // Get meta configuration for project page
  const metaConfig = project ? getMetaConfig(`/projects/${projectId}`, project) : getMetaConfig('/projects');

  // Fallback if project not found
  if (!project) {
    return (
      <div className="min-h-screen bg-[#161711] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#A8977A] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>Project Not Found</h1>
          <Link to="/" className="text-[#A8977A] hover:text-white" style={{ fontFamily: 'var(--font-sans)' }}>
            ← Back Home
          </Link>
        </div>
      </div>
    );
  }

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const sectionVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const renderImageFrame = ({ src, alt, sizeClass, hover = false, mobileSrc }) => {
    const coverClass = isScreenshotProject ? 'object-cover object-top' : 'object-cover';
    const imageClass = isBrandintelleProject
      ? 'relative z-10 w-full h-full object-contain p-4 md:p-6'
      : `relative z-10 w-full h-full ${coverClass}${hover ? ' hover:scale-105 transition-transform duration-300' : ''}`;

    const imgNode = mobileSrc ? (
      <picture>
        <source media="(max-width: 767px)" srcSet={mobileSrc} type="image/webp" />
        <img src={src} alt={alt} className={imageClass} />
      </picture>
    ) : (
      <img src={src} alt={alt} className={imageClass} />
    );

    return (
      <div
        className={`relative rounded-2xl overflow-hidden shadow-xl ${sizeClass} ${isBrandintelleProject ? 'border border-[#A8977A]/20 bg-[#1B1A15]' : ''}`}
      >
        {isBrandintelleProject && (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 20%, rgba(168, 151, 122, 0.24), transparent 45%), radial-gradient(circle at 80% 75%, rgba(111, 143, 166, 0.22), transparent 48%)'
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(168, 151, 122, 0.24) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 151, 122, 0.24) 1px, transparent 1px)',
                backgroundSize: '36px 36px'
              }}
            />
          </>
        )}
        {imgNode}
      </div>
    );
  };

  return (
    <MetaManager
      title={metaConfig.title}
      description={metaConfig.description}
      keywords={metaConfig.keywords}
      canonicalUrl={metaConfig.canonicalUrl}
      ogImage={metaConfig.ogImage}
    >
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-[#161711]"
      >
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pb-20">
        {/* Title & Description */}
        <motion.div
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          className="pt-24 mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-[#A8977A] mb-6" style={{ fontFamily: 'var(--font-sans)' }}>
            {project.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
            {project.description}
          </p>

          {/* Project Details */}
          <div className="flex flex-wrap gap-8 text-[#A8977A] text-lg">
            {project.role && (
              <>
                <div className="flex items-center gap-2">
                  <span className="font-semibold" style={{ fontFamily: 'var(--font-sans)' }}>Role:</span>
                  <span className="text-gray-300" style={{ fontFamily: 'var(--font-sans)' }}>{project.role}</span>
                </div>
                <div className="hidden md:block text-[#45372B]">|</div>
              </>
            )}
            <div className="flex items-center gap-2">
              <span className="font-semibold" style={{ fontFamily: 'var(--font-sans)' }}>Year:</span>
              <span className="text-gray-300" style={{ fontFamily: 'var(--font-sans)' }}>{project.year}</span>
            </div>
            <div className="hidden md:block text-[#45372B]">|</div>
            <div className="flex items-center gap-2">
              <span className="font-semibold" style={{ fontFamily: 'var(--font-sans)' }}>Industry:</span>
              <span className="text-gray-300" style={{ fontFamily: 'var(--font-sans)' }}>{project.industry}</span>
            </div>
            <div className="hidden md:block text-[#45372B]">|</div>
            <div className="flex items-center gap-2">
              <span className="font-semibold" style={{ fontFamily: 'var(--font-sans)' }}>Client:</span>
              <span className="text-gray-300" style={{ fontFamily: 'var(--font-sans)' }}>{project.client}</span>
            </div>
            <div className="hidden md:block text-[#45372B]">|</div>
            <div className="flex items-center gap-2">
              <span className="font-semibold" style={{ fontFamily: 'var(--font-sans)' }}>Duration:</span>
              <span className="text-gray-300" style={{ fontFamily: 'var(--font-sans)' }}>{project.duration}</span>
            </div>
            {project.roi && (
              <>
                <div className="hidden md:block text-[#45372B]">|</div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold" style={{ fontFamily: 'var(--font-sans)' }}>Impact:</span>
                  <span className="text-gray-300" style={{ fontFamily: 'var(--font-sans)' }}>{project.roi}</span>
                </div>
              </>
            )}
          </div>

          {(project.tags?.length || project.liveUrl) && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {project.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#A8977A]/30 px-4 py-2 text-sm text-[#A8977A]/90"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {tag}
                </span>
              ))}

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-[#A8977A] px-5 py-2 text-sm font-semibold text-[#161711] transition-colors hover:bg-white"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  View Live Project
                </a>
              )}
            </div>
          )}
        </motion.div>

        {/* Main Image */}
        <motion.div
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          {renderImageFrame({
            src: project.mainImage,
            alt: project.mainImageAlt || `${project.title} - Main project showcase image`,
            sizeClass: 'h-[400px] md:h-[600px]'
          })}
        </motion.div>

        {/* Problem Section */}
        <motion.div
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#A8977A] mb-6" style={{ fontFamily: 'var(--font-sans)' }}>
              {project.problem.title}
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8" style={{ fontFamily: 'var(--font-sans)' }}>
              {project.problem.description}
            </p>

            {/* Challenges/Metrics List */}
            {(project.problem.challenges || project.problem.metrics) && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#A8977A] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>Key Challenges:</h3>
                <ul className="space-y-3">
                  {(project.problem.challenges || project.problem.metrics).map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#A8977A] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300" style={{ fontFamily: 'var(--font-sans)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {renderImageFrame({
              src: project.problem.image,
              mobileSrc: project.problem.mobileImage,
              alt: project.problem.imageAlt || 'Problem illustration showing challenges faced before website redesign',
              sizeClass: 'h-[300px] md:h-[340px]'
            })}
          </div>
        </motion.div>

        {/* Solution Section */}
        <motion.div
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#A8977A] mb-6" style={{ fontFamily: 'var(--font-sans)' }}>
            {project.solution.title}
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-4xl" style={{ fontFamily: 'var(--font-sans)' }}>
            {project.solution.description}
          </p>

          {/* Features List */}
          {project.solution.features && (
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-[#A8977A] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>Key Features:</h3>
              <ul className="space-y-3">
                {project.solution.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#A8977A] rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300" style={{ fontFamily: 'var(--font-sans)' }}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Solution Images Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {project.solution.images.map((image, index) => (
              <div key={index}>
                {renderImageFrame({
                  src: image,
                  mobileSrc: project.solution.mobileImages?.[index],
                  alt: `${project.title} solution implementation view ${index + 1} - Detailed showcase of the website design and functionality improvements`,
                  sizeClass: 'h-[250px]',
                  hover: true
                })}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Challenge Section */}
        <motion.div
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.5 }}
          className="mb-20"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#A8977A] mb-6" style={{ fontFamily: 'var(--font-sans)' }}>
              {project.challenge.title}
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8" style={{ fontFamily: 'var(--font-sans)' }}>
              {project.challenge.description}
            </p>
            {renderImageFrame({
              src: project.challenge.image,
              mobileSrc: project.challenge.mobileImage,
              alt: project.challenge.imageAlt || 'Challenge illustration showing technical and design obstacles overcome',
              sizeClass: 'h-[300px] md:h-[340px]'
            })}
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.6 }}
          className="mb-20"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#A8977A] mb-6" style={{ fontFamily: 'var(--font-sans)' }}>
              {project.results.title}
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8" style={{ fontFamily: 'var(--font-sans)' }}>
              {project.results.description}
            </p>

            {/* Results/Improvements List */}
            {(project.results.improvements || project.results.metrics) && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#A8977A] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>Key Improvements:</h3>
                <ul className="space-y-3">
                  {(project.results.improvements || project.results.metrics).map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#A8977A] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300" style={{ fontFamily: 'var(--font-sans)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {renderImageFrame({
              src: project.results.image,
              mobileSrc: project.results.mobileImage,
              alt: project.results.imageAlt || 'Results illustration showing successful project outcomes and improvements',
              sizeClass: 'h-[300px] md:h-[340px]'
            })}
          </div>
        </motion.div>

        {/* More Projects Section */}
        <motion.div
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.7 }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#A8977A] mb-12 text-center" style={{ fontFamily: 'var(--font-sans)' }}>
            More Projects
          </h2>
          <div className="flex justify-center">
            <div className="grid md:grid-cols-1 gap-8 max-w-4xl">
              {allProjects.filter(p => p.id !== projectId).map((otherProject) => (
                <Link
                  key={otherProject.id}
                  to={`/projects/${otherProject.id}`}
                  className="group"
                >
                  <div className="rounded-2xl overflow-hidden shadow-xl bg-[#45372B] hover:bg-[#A8977A] transition-all duration-300">
                    <img
                      src={otherProject.mainImage}
                      alt={otherProject.mainImageAlt || `${otherProject.title} - Project preview showing professional website design`}
                      className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-[#A8977A] group-hover:text-[#161711] mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
                        {otherProject.title}
                      </h3>
                      <p className="text-gray-300 group-hover:text-[#161711] text-sm" style={{ fontFamily: 'var(--font-sans)' }}>
                        {otherProject.description.substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer CTA */}
        <motion.footer
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.8 }}
          className="text-center py-12 border-t border-[#45372B]"
        >
          <p className="text-[#A8977A] text-lg mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
            If you're building something where clarity, systems thinking, or AI can make the product sharper, let's talk.
          </p>
          <Link
            to="/about"
            className="inline-block bg-[#A8977A] text-[#161711] px-8 py-3 rounded-lg font-semibold hover:bg-white transition-colors"
          >
            <span style={{ fontFamily: 'var(--font-sans)' }}>Get In Touch</span>
          </Link>
        </motion.footer>
      </div>
      </motion.div>
    </MetaManager>
  );
}

export default ProjectPage;
