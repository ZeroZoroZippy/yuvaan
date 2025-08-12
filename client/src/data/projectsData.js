import saarth from '../assets/Projects/Saarth.png';
import wellness from '../assets/Projects/mental-wellness.png';
import dental from '../assets/Projects/Dental.png';

export const projectsData = {
    saarth: {
        id: 'saarth',
        title: 'Saarth - AI Companion',
        description: 'An intelligent AI companion designed to provide personalized mental health support and wellness guidance through natural conversations.',
        year: '2024',
        industry: 'Healthcare',
        client: 'Personal Project',
        duration: '4 months',
        mainImage: saarth,
        problem: {
            title: 'The Problem',
            description: 'Mental health support is often inaccessible, expensive, and stigmatized. Many people struggle to find immediate, judgment-free guidance when they need it most.',
            image: saarth
        },
        solution: {
            title: 'The Solution',
            description: 'Saarth provides 24/7 AI-powered mental health support through empathetic conversations, personalized coping strategies, and wellness tracking.',
            images: [saarth, saarth, saarth]
        },
        challenge: {
            title: 'Key Challenge',
            description: 'Creating an AI that could provide genuinely helpful mental health support while maintaining ethical boundaries and user safety.',
            image: saarth
        },
        summary: {
            title: 'Project Summary',
            description: 'Successfully developed an AI companion that combines natural language processing with mental health best practices, resulting in a supportive tool for wellness.',
            image: saarth
        }
    },
    dental: {
        id: 'dental',
        title: 'Dental Practice Website',
        description: 'A modern, user-friendly website for a dental practice featuring online appointment booking and patient portal functionality.',
        year: '2024',
        industry: 'Healthcare',
        client: 'Private Practice',
        duration: '3 months',
        mainImage: dental,
        problem: {
            title: 'The Problem',
            description: 'The dental practice had an outdated website that didn\'t reflect their modern approach and made it difficult for patients to book appointments.',
            image: dental
        },
        solution: {
            title: 'The Solution',
            description: 'Designed and developed a responsive website with integrated booking system, patient portal, and modern UI that reflects the practice\'s professionalism.',
            images: [dental, dental, dental]
        },
        challenge: {
            title: 'Key Challenge',
            description: 'Integrating the appointment booking system with existing practice management software while ensuring HIPAA compliance.',
            image: dental
        },
        summary: {
            title: 'Project Summary',
            description: 'Delivered a comprehensive web solution that increased online bookings by 60% and improved patient satisfaction scores.',
            image: dental
        }
    },
    wellness: {
        id: 'wellness',
        title: 'Mental Wellness Platform',
        description: 'A comprehensive wellness platform offering mood tracking, meditation guides, and community support for mental health.',
        year: '2024',
        industry: 'Wellness',
        client: 'Startup',
        duration: '5 months',
        mainImage: wellness,
        problem: {
            title: 'The Problem',
            description: 'People struggle to maintain consistent wellness routines and often lack the tools to track their mental health progress effectively.',
            image: wellness
        },
        solution: {
            title: 'The Solution',
            description: 'Built a comprehensive platform with mood tracking, guided meditations, progress analytics, and community features to support mental wellness.',
            images: [wellness, wellness, wellness]
        },
        challenge: {
            title: 'Key Challenge',
            description: 'Creating an engaging user experience that encourages daily use while handling sensitive mental health data securely.',
            image: wellness
        },
        summary: {
            title: 'Project Summary',
            description: 'Launched a successful wellness platform with over 1,000 active users and positive feedback on user engagement and mental health outcomes.',
            image: wellness
        }
    }
};

export const getProjectById = (id) => {
    return projectsData[id] || null;
};

export const getAllProjects = () => {
    return Object.values(projectsData);
};