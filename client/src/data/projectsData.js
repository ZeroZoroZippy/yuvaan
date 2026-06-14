import dental from '../assets/Projects/Dental.png';
import wellness from '../assets/Projects/mental-wellness.png';
import saarth from '../assets/Projects/saarth-companion.webp';
import saarthSupport from '../assets/Projects/saarth-support.svg';
import brandintelleBiHub from '../assets/Projects/brandintelle-bi-hub.svg';
import brandintelleAiPrototyping from '../assets/Projects/brandintelle-ai-prototyping.svg';
import brandintelleInsightOrrery from '../assets/Projects/brandintelle-insight-orrery.svg';
import sarvodayaSupport from '../assets/Projects/sarvodaya-support.svg';
import aakankshaSupport from '../assets/Projects/aakanksha-support.svg';
import stockAgentSupport from '../assets/Projects/stock-agent-support.svg';
import geothesisMain from '../assets/Projects/geothesis.webp';
import geothesisHome from '../assets/Projects/geothesis-home.webp';
import geothesisArchive from '../assets/Projects/geothesis-archive.webp';
import geothesisScoreboard from '../assets/Projects/geothesis-scoreboard.webp';
import geothesisStories from '../assets/Projects/geothesis-stories.webp';
import geothesisHomeMobile from '../assets/Projects/geothesis-home-mobile.webp';
import geothesisArchiveMobile from '../assets/Projects/geothesis-archive-mobile.webp';
import geothesisScoreboardMobile from '../assets/Projects/geothesis-scoreboard-mobile.webp';
import geothesisStoriesMobile from '../assets/Projects/geothesis-stories-mobile.webp';

export const projectsData = {
    geothesis: {
        id: 'geothesis',
        title: 'GeoThesis',
        category: 'AI System',
        cardSummary: 'A personal geopolitical market-intelligence pipeline that reads the world every morning and delivers a structured briefing to your inbox — built, deployed, and running daily.',
        description: 'A multi-agent AI system that fetches real-world geopolitical and macro events, analyzes them into structured signal cards, and emails a plain-English morning briefing tailored for the Indian market — automated, self-healing, and live.',
        year: '2026',
        industry: 'AI Systems / Finance',
        client: 'Personal project',
        duration: 'Built in one session, live daily',
        role: 'System design, agent orchestration, prompt engineering, deployment',
        tags: ['Multi-agent AI', 'Market intelligence', 'Pipeline automation', 'Python', 'OpenAI', 'Perplexity'],
        liveUrl: 'https://geothesis.vercel.app',
        mainImage: geothesisMain,
        mainImageAlt: 'GeoThesis AI pipeline by Yuvaan Vithlani — geopolitical market intelligence system delivering daily email briefings for Indian markets',

        problem: {
            title: 'Reading the News Takes an Hour. Understanding What It Means Takes Longer.',
            description: 'Wars, oil shocks, central bank moves, trade disputes — these events move Indian markets. But connecting the dots between world events and sector-level impact requires time, context, and financial literacy most working professionals do not have on a Monday morning. The alternative — financial media — either buries the signal in noise or skips the "why it matters for India" layer entirely.',
            challenges: [
                'Geopolitical events affect Indian markets indirectly — the link is rarely explained clearly',
                'Daily news is high volume, low signal — most stories don\'t matter for market positioning',
                'No existing tool connected live world events to specific Indian sectors and stocks',
                'Building a system that degrades gracefully when any single AI call fails'
            ],
            image: geothesisHome,
            mobileImage: geothesisHomeMobile,
            imageAlt: 'GeoThesis homepage — market calls with receipts, live experiment for Indian markets'
        },

        solution: {
            title: 'Three AI Agents, One Morning Email',
            description: 'GeoThesis runs three AI agents in sequence every morning at 8am IST. The Fetcher uses Perplexity to scan 6 categories of global events. The Analyzer uses GPT to turn raw events into structured signal cards — sector, direction, sensitivity, confidence. The Narrator writes them in plain English and assigns a market mood. The result lands in your inbox before you open a browser. Every briefing is archived, every call is graded against real closing prices a few days later.',
            features: [
                'Fetcher agent: Perplexity AI scanning conflicts, trade, energy, central banks, India macro, EM currency stress',
                'Analyzer agent: structured signal cards with sector mapping, direction, sensitivity, and evidence tier',
                'Narrator agent: plain-English briefing in a sharp analyst voice — implication first, numbers over adjectives',
                'Signal memory: tracks recurring stories across 14 days so Day 5 of a crisis reads as Day 5, not Day 1',
                'Thesis ledger: tracks market hypotheses over time and evaluates them against actual price moves',
                'Novelty filter: blocks exact same-day repeat events from re-entering the briefing',
                'Graceful degradation: if any agent fails, a fallback briefing is produced and stored',
                'Full Supabase persistence: every run, every event, every signal card stored for longitudinal eval',
                'Deployed on Modal with scheduled jobs at 8am, 6:30pm, and 7pm IST'
            ],
            images: [geothesisArchive, geothesisStories, geothesisScoreboard],
            mobileImages: [geothesisArchiveMobile, geothesisStoriesMobile, geothesisScoreboardMobile]
        },

        challenge: {
            title: 'Production AI That Must Not Miss a Morning',
            description: 'The hardest part was not building the pipeline — it was making it resilient. An AI system that runs daily must handle Perplexity timeouts, OpenAI rate limits, Supabase write failures, and edge cases in structured output without silently producing garbage or skipping delivery. Every stage has independent failure handling. The briefing always sends, even when the thesis layer or signal memory fails. This is what separates a prototype from a system you actually trust.',
            image: geothesisStories,
            mobileImage: geothesisStoriesMobile,
            imageAlt: 'GeoThesis Running Stories — AI tracking ongoing market narratives across multiple briefings'
        },

        results: {
            title: 'A Live, Self-Running Intelligence System at ~$1.90/Month',
            description: 'GeoThesis runs every morning without intervention. It has processed hundreds of world events, produced structured signal cards, and delivered briefings consistently since deployment. Every call is graded against real NSE closing prices — building a public accuracy record. The scoreboard is live. The misses stay up. The entire system costs under $2/month to operate.',
            improvements: [
                'Live daily operation: automated runs at 8am IST via Modal scheduled jobs',
                'Full observability: every run stored in Supabase with pipeline status, stage-level logs, and usage data',
                'Public scoreboard: AI market calls graded against real prices, 66%+ accuracy on decisive calls',
                'Signal memory: briefings reference how long a situation has been running — not just what happened today',
                'Cost: ~$1.90/month total for Perplexity + OpenAI + email delivery at personal scale',
                'Proof of systems thinking: failure modes designed before code was written, not after first crash'
            ],
            image: geothesisScoreboard,
            mobileImage: geothesisScoreboardMobile,
            imageAlt: 'GeoThesis Scoreboard — AI market calls graded against real closing prices with public accuracy record'
        }
    },

    saarth: {
        id: 'saarth',
        title: 'Saarth',
        category: 'AI Companion',
        cardSummary: 'A reflective AI companion built for moments of uncertainty, emotional clarity, and wiser conversation.',
        description: 'An AI companion designed for late-night uncertainty, built to offer reflection and steadiness instead of shallow agreement.',
        year: '2025',
        industry: 'AI Product',
        client: 'Personal project',
        duration: 'Independent build',
        role: 'Concept, product thinking, interaction design, build',
        tags: ['AI companion', 'Product thinking', 'Conversation design'],
        mainImage: saarth,
        mainImageAlt: 'Saarth project concept image by Yuvaan Vithlani featuring a calm, reflective AI companion built for moments of uncertainty',

        problem: {
            title: 'The 2 A.M. Problem',
            description: 'A lot of AI products feel capable but emotionally hollow. Saarth started from a more human question: what would it look like to build a companion for moments when someone is uncertain, restless, or looking for perspective rather than information?',
            challenges: [
                'Avoiding the “agreeable chatbot” trap',
                'Designing for emotional steadiness instead of novelty',
                'Keeping the voice reflective without sounding artificial',
                'Building a product with personal meaning, not just technical novelty'
            ],
            image: saarth,
            imageAlt: 'Concept image for Saarth showing companionship and reflective support'
        },

        solution: {
            title: 'Wisdom-Led Conversation Design',
            description: 'I shaped Saarth as a calm AI companion inspired by Lord Shri Krishna’s mindset: reflective, steady, and willing to bring clarity instead of feeding confusion. The product is meant to feel like a wise 2 a.m. friend, not another bot trying to impress you.',
            features: [
                'Conversation tone built around reflection, not flattery',
                'Product framing rooted in emotional clarity',
                'AI used as a companion layer, not just a utility',
                'Live personal project that became my first serious AI build'
            ],
            images: [saarthSupport, saarthSupport, saarthSupport]
        },

        challenge: {
            title: 'Depth Without Pretending To Be Human',
            description: 'The hard part was not generating responses. It was defining the emotional job of the product clearly enough that every design and AI decision felt coherent. Saarth needed to feel grounded and useful without pretending to replace real human connection.',
            image: saarthSupport,
            imageAlt: 'Saarth concept visual representing emotional clarity and late-night reflection'
        },

        results: {
            title: 'A Distinctive First AI Product',
            description: 'Saarth became an important turning point because it was the first project where my interest in systems, empathy, and AI came together in one product idea. It proved I care less about building flashy AI and more about building AI that feels meaningful.',
            improvements: [
                'Established a clearer personal direction toward AI-native product work',
                'Sharpened my thinking around tone, trust, and product intent',
                'Turned a philosophical idea into a usable live product',
                'Became the strongest expression of how I want to build with AI'
            ],
            image: saarthSupport,
            imageAlt: 'Saarth project visual showing a thoughtful AI companion concept'
        }
    },

    brandintelle: {
        id: 'brandintelle',
        title: 'Current Product Work at Brandintelle',
        category: 'Product Systems',
        cardSummary: 'Handling BI Hub, intelligence, and insight modules inside a real product environment while bringing AI-assisted speed and structure.',
        description: 'My current work at Brandintelle sits inside the BI Hub and intelligence layer, where I handle dense workflows, ambiguous product needs, and system-heavy modules.',
        year: '2026',
        industry: 'Business Intelligence',
        client: 'Brandintelle',
        duration: 'Ongoing',
        role: 'Product Executive',
        tags: ['Product systems', 'BI Hub', 'AI prototyping'],
        mainImage: brandintelleBiHub,
        mainImageAlt: 'Brandintelle project interface by Yuvaan Vithlani featuring product-system work across analytics, intelligence, and BI workflows',

        problem: {
            title: 'Working Inside Evolving Product Complexity',
            description: 'I joined Brandintelle with AI implementation in mind, but the business needed product ownership in the intelligence module first. That meant stepping into dashboards, BI flows, and insight systems that required fast learning, structure, and judgment under ambiguity.',
            challenges: [
                'Adapting quickly to a dense business domain',
                'Handling intelligence and analytics modules without being reduced to “the dashboard person”',
                'Turning evolving founder direction into structured product work',
                'Introducing AI thinking in a company still early in its adoption'
            ],
            image: brandintelleAiPrototyping,
            imageAlt: 'Brandintelle interface showing complex dashboard and intelligence workflows'
        },

        solution: {
            title: 'Structure, Clarity, and Faster Product Movement',
            description: 'The work has involved understanding difficult systems fast, reducing ambiguity, and helping product modules become clearer and more usable. Alongside the dashboards themselves, one of my real contributions has been bringing AI into how work gets broken down, prototyped, and explained internally.',
            features: [
                'Handled BI Hub, intelligence, and insight-oriented product work',
                'Contributed across ads, spends, executive, and intelligence contexts',
                'Used AI to prototype faster and help others think more clearly',
                'Built stronger product intuition in a real operating environment'
            ],
            images: [brandintelleBiHub, brandintelleAiPrototyping, brandintelleInsightOrrery]
        },

        challenge: {
            title: 'Owning The Module Without Letting It Define Me',
            description: 'This work is important proof of product depth, but it is not my entire identity. The challenge has been to do justice to the complexity of the role while staying honest that this is the current context I am operating in, not the only kind of work I want to be known for.',
            image: brandintelleAiPrototyping,
            imageAlt: 'Illustrated Brandintelle workflow showing AI-assisted prototyping and structured product thinking'
        },

        results: {
            title: 'Professional Depth And Internal AI Momentum',
            description: 'Brandintelle has become the strongest proof that I can work inside real complexity, not just side projects. It has also been the place where my comfort with AI started influencing how work moves around me, even before a formal AI initiative fully takes off.',
            improvements: [
                'Built confidence in handling dense product systems',
                'Showed the company a faster AI-assisted way of working',
                'Learned how to translate ambiguous scope into product structure',
                'Added professional maturity to the broader portfolio narrative'
            ],
            image: brandintelleInsightOrrery,
            imageAlt: 'Illustrated Brandintelle system map representing intelligence modules orbiting a shared product center'
        }
    },

    sarvodaya: {
        id: 'sarvodaya',
        title: 'Sarvodaya Dental Clinic',
        category: 'Client Work',
        cardSummary: 'A cleaner, trust-building digital experience for a real clinic, built to make care feel credible and accessible.',
        description: 'A client website focused on trust, clarity, and a smoother path from interest to appointment booking.',
        year: '2024',
        industry: 'Healthcare',
        client: 'Sarvodaya Dental Clinic',
        duration: '6 weeks',
        role: 'Design, build, delivery',
        tags: ['Client website', 'Trust design', 'Business presence'],
        liveUrl: 'https://www.sarvodayadental.com/',
        mainImage: dental,
        mainImageAlt: 'Sarvodaya Dental Clinic website project by Yuvaan Vithlani featuring clean layout, trust-building structure, and appointment booking interface',

        problem: {
            title: 'Trust And Booking Friction',
            description: 'The clinic needed a digital presence that felt modern, credible, and easy for patients to act on. The old experience did not do enough to build confidence or make simple tasks like understanding services and booking appointments feel easy.',
            challenges: [
                'Outdated design weakened perceived credibility',
                'Important information was hard to find quickly',
                'Booking flow lacked clarity and convenience',
                'The experience needed to work smoothly on mobile'
            ],
            image: sarvodayaSupport,
            imageAlt: 'Sarvodaya Dental Clinic website visual showing trust-focused dental website design'
        },

        solution: {
            title: 'A Clearer Digital Front Door',
            description: 'I redesigned the site to feel polished, calm, and direct. The structure was built around the questions a new visitor is likely to have first: what this clinic offers, why it feels trustworthy, and how easily an appointment can be booked.',
            features: [
                'Clean service presentation and stronger information hierarchy',
                'Integrated booking and conversion-focused pathways',
                'Mobile-first responsive experience',
                'Visual language built to increase trust without clutter'
            ],
            images: [sarvodayaSupport, sarvodayaSupport, sarvodayaSupport]
        },

        challenge: {
            title: 'Balancing Professionalism With Warmth',
            description: 'Healthcare sites can easily become either too sterile or too decorative. The challenge here was getting the tone right: professional enough to build confidence, but clear and human enough to feel approachable.',
            image: sarvodayaSupport,
            imageAlt: 'Sarvodaya Dental Clinic project visual representing design decisions around trust and clarity'
        },

        results: {
            title: 'A Stronger Business Presence',
            description: 'Sarvodaya remains one of the clearest examples of client-facing execution in my portfolio. It shows I can take a real business need, understand the trust problem underneath it, and deliver a cleaner digital system around that.',
            improvements: [
                'More credible first impression for new patients',
                'Simpler path from discovery to appointment intent',
                'Cleaner design system for long-term use',
                'Stronger proof of polished client delivery'
            ],
            image: sarvodayaSupport,
            imageAlt: 'Final Sarvodaya Dental Clinic website outcome'
        }
    },

    'stock-agent': {
        id: 'stock-agent',
        title: 'Multi-Agent Stock Research System',
        category: 'AI Experiment',
        cardSummary: 'A multi-agent decision-support workflow that researches a sector, compares companies, and narrows the space into investable candidates.',
        description: 'A multi-agent AI system that takes a sector prompt, researches relevant companies and recent news, and returns a narrower set of high-conviction stock ideas.',
        year: '2026',
        industry: 'AI Systems',
        client: 'Personal project',
        duration: 'Experimental build',
        role: 'System design, orchestration, prompting, output design',
        tags: ['Multi-agent', 'Decision support', 'Research automation'],
        mainImage: stockAgentSupport,
        mainImageAlt: 'Multi-agent stock research project visual by Yuvaan Vithlani featuring AI decision support, company comparison, and structured analysis',

        problem: {
            title: 'Research Is Slow, Messy, And Repetitive',
            description: 'Equity research often means spending hours gathering scattered context before any real judgment begins. I wanted to test whether a multi-agent system could take over the research-heavy part of that process and surface a smaller, more usable decision space.',
            challenges: [
                'Breaking research into agent-sized responsibilities',
                'Keeping outputs structured instead of generic',
                'Making live context and news part of the reasoning loop',
                'Avoiding “AI hype” output that sounds smart but says little'
            ],
            image: stockAgentSupport,
            imageAlt: 'Illustration of decision-making and stock analysis for a multi-agent AI workflow'
        },

        solution: {
            title: 'Hierarchical Multi-Agent Orchestration',
            description: 'The system takes an industry as input, researches top companies in that space, looks at their recent news and market context, and then returns a smaller set of stocks with a clearer thesis. The point was not to replace judgment, but to compress the research setup time dramatically.',
            features: [
                'Industry-based discovery of relevant companies',
                'Web research and live-context collection',
                'Agent orchestration for comparison and synthesis',
                'Structured output that narrows options into a smaller decision set'
            ],
            images: [stockAgentSupport, stockAgentSupport, stockAgentSupport]
        },

        challenge: {
            title: 'Useful Decision Support Instead Of Fancy Automation',
            description: 'Plenty of AI finance projects look impressive but produce shallow recommendations. The real challenge here was to make the system feel like structured decision support rather than a gimmick built around the word “agent.”',
            image: stockAgentSupport,
            imageAlt: 'Stock research concept visual showing structured AI-driven analysis'
        },

        results: {
            title: 'A Stronger Experiment In AI Systems Thinking',
            description: 'This project matters less because it picks stocks and more because it sharpened how I think about decomposition, orchestration, and AI systems that help a user move from too much information toward a usable answer.',
            improvements: [
                'Strengthened my thinking around multi-agent decomposition',
                'Made research-heavy workflows feel more tractable',
                'Created a better bridge between AI experimentation and product utility',
                'Added a second serious AI proof point beside Saarth'
            ],
            image: stockAgentSupport,
            imageAlt: 'Multi-agent stock research system visual representing structured AI experimentation'
        }
    },

    aakanksha: {
        id: 'aakanksha',
        title: 'Therapy With Aakanksha',
        category: 'Client Work',
        cardSummary: 'An empathy-led website for a therapy practice, designed to feel calm, safe, and human from the first interaction.',
        description: 'A therapy practice website shaped around emotional sensitivity, trust, and the first-step experience of reaching out for help.',
        year: '2024',
        industry: 'Mental Health',
        client: 'Therapy With Aakanksha',
        duration: '8 weeks',
        role: 'Design, build, content shaping',
        tags: ['Client website', 'Empathy-led UX', 'Trust design'],
        liveUrl: 'https://www.therapywithaakanksha.com',
        mainImage: wellness,
        mainImageAlt: 'Therapy With Aakanksha website project by Yuvaan Vithlani featuring warm, calm, and approachable therapy practice design',

        problem: {
            title: 'The First Step Needed To Feel Safe',
            description: 'A therapy website is often part of an emotionally vulnerable moment. The challenge was to create a first impression that felt warm and reassuring rather than overly clinical, vague, or intimidating.',
            challenges: [
                'Reducing anxiety around reaching out',
                'Making therapy feel understandable and approachable',
                'Balancing warmth with professional credibility',
                'Designing a calmer path into contact and booking'
            ],
            image: aakankshaSupport,
            imageAlt: 'Therapy With Aakanksha website visual focused on warmth and emotional accessibility'
        },

        solution: {
            title: 'An Empathy-Led Digital Presence',
            description: 'I structured the site around what a hesitant visitor might need most: clarity, calmness, and low-pressure ways to understand the practice before taking action. The design was intentionally soft in tone but still grounded and usable.',
            features: [
                'Warm visual tone with clear information hierarchy',
                'Simple explanation of services and process',
                'Low-pressure pathways into contact and booking',
                'Digital experience built around emotional trust'
            ],
            images: [aakankshaSupport, aakankshaSupport, aakankshaSupport]
        },

        challenge: {
            title: 'Warm Without Losing Professional Weight',
            description: 'Therapy websites can feel either too polished to be human or too casual to inspire confidence. The challenge was to create an experience that respected the emotional sensitivity of the context while still feeling credible.',
            image: aakankshaSupport,
            imageAlt: 'Therapy website visual representing balance between emotional warmth and professional trust'
        },

        results: {
            title: 'A Softer, More Human First Impression',
            description: 'This project remains a good example of how I think about user empathy in practice. The value was not just in the visuals, but in shaping a digital experience that respects how someone might feel before they are ready to reach out.',
            improvements: [
                'Reduced intimidation in the first contact experience',
                'Created a calmer and clearer therapy brand presence',
                'Showed stronger empathy-led design judgment',
                'Added a second real client proof point to the portfolio'
            ],
            image: aakankshaSupport,
            imageAlt: 'Final Therapy With Aakanksha website outcome'
        }
    }
};

export const featuredProjectOrder = ['geothesis', 'saarth', 'brandintelle', 'sarvodaya', 'stock-agent', 'aakanksha'];

export const portfolioFocus = {
    specialization: 'Product-minded systems thinking across client work, internal products, and AI experiments',
    approach: 'Use systems thinking, user empathy, and AI-assisted building to turn ambiguity into clearer digital products',
    understanding: 'Product structure, human decision-making, and the realities of shipping inside both business and personal contexts'
};

export const nextSteps = {
    cta: 'Build Something Thoughtful',
    offer: 'Open to conversations around product systems, AI exploration, and meaningful digital work',
    value: 'The strongest work usually starts with a better definition of the problem, not a rush to features'
};

export const getProjectById = (id) => {
    return projectsData[id] || null;
};

export const getAllProjects = () => {
    return featuredProjectOrder.map((id) => projectsData[id]).filter(Boolean);
};

export const getFeaturedProjects = () => {
    return getAllProjects().map((project) => ({
        id: project.id,
        title: project.title,
        category: project.category,
        summary: project.cardSummary,
        image: project.mainImage,
        imageAlt: project.mainImageAlt
    }));
};
