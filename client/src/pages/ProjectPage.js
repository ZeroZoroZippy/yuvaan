import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { getProjectById, getAllProjects } from '../data/projectsData'; // Import the data

function ProjectPage() {
  const { projectId } = useParams();

  // Get project data from our optimized structure
  const project = getProjectById(projectId);
  const allProjects = getAllProjects();

  // Fallback if project not found
  if (!project) {
    return (
      <div className="min-h-screen bg-[#161711] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#A8977A] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>Project Not Found</h1>
          <Link to="/projects" className="text-[#A8977A] hover:text-white" style={{ fontFamily: 'Neuton, serif' }}>
            ← Back to Projects
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

  return (
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
          <h1 className="text-4xl md:text-6xl font-bold text-[#A8977A] mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
            {project.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl leading-relaxed" style={{ fontFamily: 'Neuton, serif' }}>
            {project.description}
          </p>

          {/* Project Details */}
          <div className="flex flex-wrap gap-8 text-[#A8977A] text-lg">
            <div className="flex items-center gap-2">
              <span className="font-semibold" style={{ fontFamily: 'Neuton, serif' }}>Year:</span>
              <span className="text-gray-300" style={{ fontFamily: 'Neuton, serif' }}>{project.year}</span>
            </div>
            <div className="hidden md:block text-[#45372B]">|</div>
            <div className="flex items-center gap-2">
              <span className="font-semibold" style={{ fontFamily: 'Neuton, serif' }}>Industry:</span>
              <span className="text-gray-300" style={{ fontFamily: 'Neuton, serif' }}>{project.industry}</span>
            </div>
            <div className="hidden md:block text-[#45372B]">|</div>
            <div className="flex items-center gap-2">
              <span className="font-semibold" style={{ fontFamily: 'Neuton, serif' }}>Client:</span>
              <span className="text-gray-300" style={{ fontFamily: 'Neuton, serif' }}>{project.client}</span>
            </div>
            <div className="hidden md:block text-[#45372B]">|</div>
            <div className="flex items-center gap-2">
              <span className="font-semibold" style={{ fontFamily: 'Neuton, serif' }}>Duration:</span>
              <span className="text-gray-300" style={{ fontFamily: 'Neuton, serif' }}>{project.duration}</span>
            </div>
            {project.roi && (
              <>
                <div className="hidden md:block text-[#45372B]">|</div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold" style={{ fontFamily: 'Neuton, serif' }}>Impact:</span>
                  <span className="text-gray-300" style={{ fontFamily: 'Neuton, serif' }}>{project.roi}</span>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Main Image */}
        <motion.div
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={project.mainImage}
              alt={project.title}
              className="w-full h-[400px] md:h-[600px] object-cover"
            />
          </div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-[#A8977A] mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
              {project.problem.title}
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8" style={{ fontFamily: 'Neuton, serif' }}>
              {project.problem.description}
            </p>

            {/* Challenges/Metrics List */}
            {(project.problem.challenges || project.problem.metrics) && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#A8977A] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>Key Challenges:</h3>
                <ul className="space-y-3">
                  {(project.problem.challenges || project.problem.metrics).map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#A8977A] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300" style={{ fontFamily: 'Neuton, serif' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src={project.problem.image}
                alt="Problem illustration"
                className="w-full h-[300px] object-cover"
              />
            </div>
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
          <h2 className="text-3xl md:text-4xl font-bold text-[#A8977A] mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
            {project.solution.title}
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-4xl" style={{ fontFamily: 'Neuton, serif' }}>
            {project.solution.description}
          </p>

          {/* Features List */}
          {project.solution.features && (
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-[#A8977A] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>Key Features:</h3>
              <ul className="space-y-3">
                {project.solution.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#A8977A] rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300" style={{ fontFamily: 'Neuton, serif' }}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Solution Images Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {project.solution.images.map((image, index) => (
              <div key={index} className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={image}
                  alt={`Solution view ${index + 1}`}
                  className="w-full h-[250px] object-cover hover:scale-105 transition-transform duration-300"
                />
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
            <h2 className="text-3xl md:text-4xl font-bold text-[#A8977A] mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
              {project.challenge.title}
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8" style={{ fontFamily: 'Neuton, serif' }}>
              {project.challenge.description}
            </p>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src={project.challenge.image}
                alt="Challenge illustration"
                className="w-full h-[300px] object-cover"
              />
            </div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-[#A8977A] mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
              {project.results.title}
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8" style={{ fontFamily: 'Neuton, serif' }}>
              {project.results.description}
            </p>

            {/* Results/Improvements List */}
            {(project.results.improvements || project.results.metrics) && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#A8977A] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>Key Improvements:</h3>
                <ul className="space-y-3">
                  {(project.results.improvements || project.results.metrics).map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#A8977A] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300" style={{ fontFamily: 'Neuton, serif' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src={project.results.image}
                alt="Results illustration"
                className="w-full h-[300px] object-cover"
              />
            </div>
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
          <h2 className="text-3xl md:text-4xl font-bold text-[#A8977A] mb-12 text-center" style={{ fontFamily: 'Syne, sans-serif' }}>
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
                      alt={otherProject.title}
                      className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-[#A8977A] group-hover:text-[#161711] mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                        {otherProject.title}
                      </h3>
                      <p className="text-gray-300 group-hover:text-[#161711] text-sm" style={{ fontFamily: 'Neuton, serif' }}>
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
          <p className="text-[#A8977A] text-lg mb-4" style={{ fontFamily: 'Neuton, serif' }}>
            Need a healthcare website that converts visitors into patients?
          </p>
          <Link
            to="/contact"
            className="inline-block bg-[#A8977A] text-[#161711] px-8 py-3 rounded-lg font-semibold hover:bg-white transition-colors"
          >
            <span style={{ fontFamily: 'Neuton, serif' }}>Start Your Project</span>
          </Link>
        </motion.footer>
      </div>
    </motion.div>
  );
}

export default ProjectPage;