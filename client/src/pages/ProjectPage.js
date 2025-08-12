import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

function ProjectPage() {
  const { projectId } = useParams();

  // Dummy project data
  const projectData = {
    saarth: {
      title: 'Saarth - AI Companion',
      description: 'An intelligent AI companion designed to provide personalized mental health support and wellness guidance through natural conversations.',
      year: '2024',
      industry: 'Healthcare',
      client: 'Personal Project',
      duration: '4 months'
    },
    dental: {
      title: 'Dental Practice Website',
      description: 'A modern, user-friendly website for a dental practice featuring online appointment booking and patient portal functionality.',
      year: '2024',
      industry: 'Healthcare',
      client: 'Private Practice',
      duration: '3 months'
    },
    wellness: {
      title: 'Mental Wellness Platform',
      description: 'A comprehensive wellness platform offering mood tracking, meditation guides, and community support for mental health.',
      year: '2024',
      industry: 'Wellness',
      client: 'Startup',
      duration: '5 months'
    }
  };

  const project = projectData[projectId] || projectData.saarth;

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
          <h1 className="text-4xl md:text-6xl font-bold text-[#A8977A] mb-6">
            {project.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl leading-relaxed">
            {project.description}
          </p>

          {/* Year, Industry, Client, Duration (Horizontal display) */}
          <div className="flex flex-wrap gap-8 text-[#A8977A] text-lg">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Year:</span>
              <span className="text-gray-300">{project.year}</span>
            </div>
            <div className="hidden md:block text-[#45372B]">|</div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Industry:</span>
              <span className="text-gray-300">{project.industry}</span>
            </div>
            <div className="hidden md:block text-[#45372B]">|</div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Client:</span>
              <span className="text-gray-300">{project.client}</span>
            </div>
            <div className="hidden md:block text-[#45372B]">|</div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Duration:</span>
              <span className="text-gray-300">{project.duration}</span>
            </div>
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
          <div className="rounded-2xl overflow-hidden shadow-2xl bg-[#45372B]">
            <div className="w-full h-[400px] md:h-[600px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-[#A8977A] rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-12 h-12 text-[#161711]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                  </svg>
                </div>
                <p className="text-[#A8977A] text-lg">Main Project Image</p>
                <p className="text-gray-400 text-sm">Hero showcase image will be placed here</p>
              </div>
            </div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-[#A8977A] mb-6">
              The Problem
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              This section describes the core problem that the project aimed to solve. It provides context about the challenges faced by users or the market gap that needed to be addressed. The problem statement helps visitors understand the motivation behind the project.
            </p>
            <div className="rounded-2xl overflow-hidden shadow-xl bg-[#45372B]">
              <div className="w-full h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#A8977A] rounded-full flex items-center justify-center mb-3 mx-auto">
                    <svg className="w-8 h-8 text-[#161711]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <p className="text-[#A8977A]">Problem Image</p>
                </div>
              </div>
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
          <h2 className="text-3xl md:text-4xl font-bold text-[#A8977A] mb-6">
            The Solution
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-12 max-w-4xl">
            Here we explain how the project addressed the identified problem. This section outlines the approach taken, key features implemented, and the overall strategy used to create an effective solution. It demonstrates the thought process and methodology behind the project.
          </p>

          {/* Solution Images Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((index) => (
              <div key={index} className="rounded-2xl overflow-hidden shadow-xl bg-[#45372B]">
                <div className="w-full h-[250px] flex items-center justify-center hover:bg-[#A8977A] hover:bg-opacity-10 transition-colors duration-300">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#A8977A] rounded-full flex items-center justify-center mb-2 mx-auto">
                      <span className="text-[#161711] font-bold">{index}</span>
                    </div>
                    <p className="text-[#A8977A] text-sm">Solution Image {index}</p>
                  </div>
                </div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-[#A8977A] mb-6">
              Key Challenge
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              Every project faces unique challenges during development. This section highlights the most significant obstacle encountered and how it was overcome. It showcases problem-solving skills and the ability to adapt when faced with unexpected difficulties during the project lifecycle.
            </p>
            <div className="rounded-2xl overflow-hidden shadow-xl bg-[#45372B]">
              <div className="w-full h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#A8977A] rounded-full flex items-center justify-center mb-3 mx-auto">
                    <svg className="w-8 h-8 text-[#161711]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <p className="text-[#A8977A]">Challenge Image</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Summary Section */}
        <motion.div
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.6 }}
          className="mb-20"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#A8977A] mb-6">
              Project Summary
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              This final section wraps up the project case study by summarizing the key outcomes, lessons learned, and impact achieved. It provides closure to the project story and highlights the value delivered to the client or end users through the successful completion of this work.
            </p>
            <div className="rounded-2xl overflow-hidden shadow-xl bg-[#45372B]">
              <div className="w-full h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#A8977A] rounded-full flex items-center justify-center mb-3 mx-auto">
                    <svg className="w-8 h-8 text-[#161711]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-[#A8977A]">Summary Image</p>
                </div>
              </div>
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
          <h2 className="text-3xl md:text-4xl font-bold text-[#A8977A] mb-12 text-center">
            More Projects
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {['saarth', 'dental', 'wellness'].filter(id => id !== projectId).map((id) => (
              <Link
                key={id}
                to={`/projects/${id}`}
                className="group"
              >
                <div className="rounded-2xl overflow-hidden shadow-xl bg-[#45372B] hover:bg-[#A8977A] transition-all duration-300">
                  <div className="w-full h-[200px] flex items-center justify-center group-hover:bg-opacity-10">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#A8977A] group-hover:bg-[#161711] rounded-full flex items-center justify-center mb-3 mx-auto transition-colors">
                        <svg className="w-8 h-8 text-[#161711] group-hover:text-[#A8977A]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                        </svg>
                      </div>
                      <p className="text-[#A8977A] group-hover:text-[#161711] font-semibold">Project Image</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#A8977A] group-hover:text-[#161711] mb-2">
                      {projectData[id]?.title || 'Project Title'}
                    </h3>
                    <p className="text-gray-300 group-hover:text-[#161711] text-sm">
                      {projectData[id]?.description.substring(0, 100) || 'Project description'}...
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.8 }}
          className="text-center py-12 border-t border-[#45372B]"
        >
          <p className="text-[#A8977A] text-lg mb-4">
            Interested in working together?
          </p>
          <Link
            to="/about"
            className="inline-block bg-[#A8977A] text-[#161711] px-8 py-3 rounded-lg font-semibold hover:bg-white transition-colors"
          >
            Get In Touch
          </Link>
        </motion.footer>
      </div>
    </motion.div>
  );
}

export default ProjectPage;