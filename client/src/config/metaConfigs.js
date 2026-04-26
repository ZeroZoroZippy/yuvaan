// Meta configuration objects for each page route
// Based on requirements 1.1, 1.2, 1.3, 2.1, 2.2, 2.3

export const metaConfigs = {
  home: {
    title: "Yuvaan Vithlani - Product Systems & AI Portfolio",
    description: "Portfolio of Yuvaan Vithlani, a product-minded systems thinker using user empathy and AI-assisted building to turn ambiguity into clear digital products.",
    keywords: "Yuvaan Vithlani, Product Executive, Systems Thinking, AI Portfolio, Digital Products, Product Strategy, AI Prototyping",
    canonicalUrl: "https://yuvaanvithlani.com/",
    ogImage: "/assets/Hero/Hero.webp"
  },
  
  about: {
    title: "About Yuvaan Vithlani - Systems Thinking, Product & AI",
    description: "Learn how Yuvaan Vithlani works across product systems, client projects, and AI experiments with a focus on clarity, empathy, and thoughtful execution.",
    keywords: "Yuvaan Vithlani About, Systems Thinking, Product Work, AI Exploration, User Empathy, Digital Product Thinking",
    canonicalUrl: "https://yuvaanvithlani.com/about",
    ogImage: "/assets/About/about-hero.webp"
  },
  
  projects: {
    title: "Work - Yuvaan Vithlani | Product, Client & AI Projects",
    description: "Explore Yuvaan Vithlani's selected work across AI experiments, client projects, and real product systems inside Brandintelle.",
    keywords: "Yuvaan Vithlani Work, AI Projects, Product Portfolio, Client Websites, Brandintelle, Systems Thinking",
    canonicalUrl: "https://yuvaanvithlani.com/projects",
    ogImage: "/assets/Projects/projects-showcase.webp"
  },
  
  // Dynamic project page meta (to be used with project-specific data)
  projectDetail: (projectData) => ({
    title: `${projectData.title} - Work by Yuvaan Vithlani | Product & AI Portfolio`,
    description: `${projectData.description} - Selected work by Yuvaan Vithlani across product systems, client execution, and AI-assisted building.`,
    keywords: `${projectData.title}, ${projectData.tags?.join(', ') || ''}, Yuvaan Vithlani, Product Portfolio, AI Project`,
    canonicalUrl: `https://yuvaanvithlani.com/projects/${projectData.id}`,
    ogImage: projectData.mainImage || "/assets/Projects/default-project.webp"
  }),
  
  // Default fallback meta
  default: {
    title: "Yuvaan Vithlani - Product Systems & AI Portfolio",
    description: "Portfolio of Yuvaan Vithlani, a product-minded systems thinker working across digital products, client work, and AI experiments.",
    keywords: "Yuvaan Vithlani, Product Portfolio, Systems Thinking, AI, Digital Products",
    canonicalUrl: "https://yuvaanvithlani.com/",
    ogImage: "/assets/Hero/Hero.webp"
  }
};

// Helper function to get meta config by route
export const getMetaConfig = (route, data = null) => {
  switch (route) {
    case '/':
    case '/home':
      return metaConfigs.home;
    case '/about':
      return metaConfigs.about;
    case '/projects':
      return metaConfigs.projects;
    default:
      // Handle dynamic routes
      if (route.startsWith('/projects/') && data) {
        return metaConfigs.projectDetail(data);
      }
      return metaConfigs.default;
  }
};

export default metaConfigs;
