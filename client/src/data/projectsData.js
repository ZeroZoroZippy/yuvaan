import dental from '../assets/Projects/Dental.png';
import wellness from '../assets/Projects/mental-wellness.png';

export const projectsData = {
    dental: {
        id: 'dental',
        title: 'Modern Dental Practice Website',
        description: 'Transformed an outdated dental website into a professional, patient-friendly digital presence with integrated appointment booking.',
        year: '2024',
        industry: 'Healthcare',
        client: 'Local Dental Practice',
        duration: '6 weeks',
        mainImage: dental,
        mainImageAlt: "Modern dental practice website homepage showing clean, professional design with appointment booking interface and patient-friendly navigation",
        
        problem: {
            title: 'The Professional Image Problem',
            description: 'The dental practice was using an outdated website that didn\'t reflect their modern approach to patient care. Potential patients couldn\'t easily find basic information like services offered, insurance accepted, or office hours. Without online booking, patients had to call during business hours or wait for a callback - creating friction in the appointment process.',
            challenges: [
                'Outdated design undermined professional credibility',
                'No online appointment booking system',
                'Difficult to find essential practice information',
                'Not optimized for mobile devices'
            ],
            image: dental,
            imageAlt: "Screenshot of outdated dental practice website showing poor design and lack of modern features"
        },
        
        solution: {
            title: 'The Patient-Centered Design',
            description: 'I created a modern, professional website that puts patient needs first. The new design clearly presents services, makes insurance information easy to find, and includes an integrated booking system. Every page is designed to reduce dental anxiety through calming visuals and clear, jargon-free language.',
            features: [
                'Integrated online appointment booking',
                'Mobile-responsive design for all devices',
                'Clear service descriptions and pricing transparency',
                'HIPAA-compliant contact forms'
            ],
            images: [dental, dental, dental]
        },
        
        challenge: {
            title: 'The Technical Integration Challenge',
            description: 'The biggest challenge was integrating a modern booking system while maintaining HIPAA compliance and ensuring the design worked seamlessly across all devices. Healthcare websites require special attention to privacy regulations and professional presentation standards.',
            image: dental,
            imageAlt: "Technical diagram showing HIPAA-compliant booking system integration with responsive design elements"
        },
        
        results: {
            title: 'Professional Digital Presence',
            description: 'The practice now has a website that matches the quality of their patient care. Patients can book appointments 24/7, find information easily, and feel confident about the practice before their first visit. The professional appearance reinforces trust and credibility.',
            improvements: [
                'Professional appearance that builds patient trust',
                '24/7 online appointment booking capability',
                'Mobile-friendly experience for all visitors',
                'Clear, accessible information about services and policies'
            ],
            image: dental,
            imageAlt: "Final dental practice website showing professional design with integrated appointment booking and mobile-responsive layout"
        }
    },
    
    wellness: {
        id: 'wellness',
        title: 'Mental Wellness Practice Website',
        description: 'Created a welcoming, approachable website that makes seeking mental health support feel safe and judgment-free.',
        year: '2024',
        industry: 'Mental Health',
        client: 'Mental Wellness Practitioner',
        duration: '8 weeks',
        mainImage: wellness,
        mainImageAlt: "Mental wellness practice website homepage featuring warm, approachable design with calming colors and welcoming messaging for therapy clients",
        
        problem: {
            title: 'The Accessibility Barrier',
            description: 'The mental health practitioner needed a website that would make potential clients feel comfortable reaching out. Many people seeking therapy already feel vulnerable, so the website needed to reduce barriers rather than create them. The previous site used clinical language and formal presentation that could feel intimidating to someone taking their first step toward mental health support.',
            challenges: [
                'Clinical language felt intimidating to potential clients',
                'Unclear about what therapy actually involves',
                'No easy way to take the first step toward booking',
                'Design didn\'t convey warmth and approachability'
            ],
            image: wellness,
            imageAlt: "Before screenshot of clinical, intimidating mental health website with formal language and cold design"
        },
        
        solution: {
            title: 'The Empathy-First Approach',
            description: 'I designed the website around the visitor\'s emotional journey, using warm, welcoming visuals and accessible language. The site explains the therapy process clearly, addresses common concerns, and provides multiple low-pressure ways to connect. Every element is designed to reduce anxiety about taking that first step.',
            features: [
                'Warm, approachable design that reduces anxiety',
                'Clear explanation of the therapy process',
                'Multiple contact options with varying commitment levels',
                'FAQ section addressing common therapy concerns'
            ],
            images: [wellness, wellness, wellness]
        },
        
        challenge: {
            title: 'The Trust and Credibility Balance',
            description: 'Mental health websites must balance approachability with professionalism. The design needed to feel welcoming and safe while still conveying the practitioner\'s expertise and credentials. Finding the right tone and visual approach required understanding both the client\'s needs and the visitor\'s emotional state.',
            image: wellness,
            imageAlt: "Design mockups showing balance between professional credentials and warm, approachable mental health website design"
        },
        
        results: {
            title: 'Welcoming Digital Gateway',
            description: 'The new website serves as a comfortable first step for people considering therapy. Visitors can learn about the process, understand what to expect, and reach out when they\'re ready - all in an environment that feels supportive rather than clinical.',
            improvements: [
                'Approachable design that reduces therapy stigma',
                'Clear information about the therapeutic process',
                'Multiple ways for visitors to connect at their comfort level',
                'Professional credibility combined with personal warmth'
            ],
            image: wellness,
            imageAlt: "Final mental wellness website showing warm, welcoming design with clear therapy information and multiple contact options"
        }
    }
};

// Portfolio positioning (honest)
export const portfolioFocus = {
    specialization: 'Healthcare & Wellness Websites',
    approach: 'Patient-centered design that builds trust and reduces barriers',
    understanding: 'HIPAA compliance, patient psychology, and professional credibility requirements'
};

export const nextSteps = {
    cta: 'Discuss Your Healthcare Website Needs',
    offer: 'Free consultation to review your current digital presence',
    value: 'Get specific recommendations for improving patient experience on your website'
};

export const getProjectById = (id) => {
    return projectsData[id] || null;
};

export const getAllProjects = () => {
    return Object.values(projectsData);
};