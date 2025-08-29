// Meta configuration objects for each page route
// Based on requirements 1.1, 1.2, 1.3, 2.1, 2.2, 2.3

export const metaConfigs = {
  home: {
    title: "Yuvaan Vithlani - Web Designer & Developer Portfolio | UI/UX Specialist",
    description: "Yuvaan Vithlani - Web Designer & Developer creating beautiful, functional digital experiences. View my portfolio of responsive websites and UI/UX projects.",
    keywords: "Yuvaan Vithlani, Web Designer, Developer, UI/UX, Portfolio, Digital Solutions, React Developer, Frontend Developer",
    canonicalUrl: "https://yuvaanvithlani.com/",
    ogImage: "/assets/Hero/Hero.webp"
  },
  
  about: {
    title: "About Yuvaan Vithlani - Web Designer & Developer | Background & Skills",
    description: "Learn about Yuvaan Vithlani's journey as a web developer and designer. Discover my skills, experience, and passion for creating user-centered digital solutions.",
    keywords: "Yuvaan Vithlani About, Web Developer Background, UI/UX Designer Skills, Professional Experience, Digital Solutions Expert",
    canonicalUrl: "https://yuvaanvithlani.com/about",
    ogImage: "/assets/About/about-hero.webp"
  },
  
  blog: {
    title: "Blog - Yuvaan Vithlani | Web Development & Design Insights",
    description: "Read Yuvaan Vithlani's insights on web development, design trends, and technology. Stay updated with the latest in digital innovation and best practices.",
    keywords: "Web Development Blog, Design Insights, Technology Trends, Digital Innovation, Frontend Development Tips, UI/UX Best Practices",
    canonicalUrl: "https://yuvaanvithlani.com/blog",
    ogImage: "/assets/Hero/Hero.webp"
  },
  
  projects: {
    title: "Projects - Yuvaan Vithlani | Web Development Portfolio",
    description: "Explore Yuvaan Vithlani's web development and design projects. See responsive websites, UI/UX designs, and digital solutions created for various clients.",
    keywords: "Web Development Projects, UI/UX Portfolio, Responsive Websites, Digital Solutions, Client Work, Design Portfolio",
    canonicalUrl: "https://yuvaanvithlani.com/projects",
    ogImage: "/assets/Projects/projects-showcase.webp"
  },
  
  // Dynamic project page meta (to be used with project-specific data)
  projectDetail: (projectData) => ({
    title: `${projectData.title} - Project by Yuvaan Vithlani | Web Development Portfolio`,
    description: `${projectData.description} - A web development project by Yuvaan Vithlani showcasing ${projectData.technologies?.join(', ') || 'modern web technologies'}.`,
    keywords: `${projectData.title}, ${projectData.technologies?.join(', ') || ''}, Web Development Project, Yuvaan Vithlani Portfolio`,
    canonicalUrl: `https://yuvaanvithlani.com/projects/${projectData.id}`,
    ogImage: projectData.image || "/assets/Projects/default-project.webp"
  }),
  
  // Dynamic blog post meta (to be used with blog post data)
  blogPost: (postData) => ({
    title: `${postData.title} | Yuvaan Vithlani Blog`,
    description: postData.excerpt || postData.description || `Read ${postData.title} by Yuvaan Vithlani. Insights on web development, design, and technology.`,
    keywords: `${postData.tags?.join(', ') || ''}, Web Development Blog, Yuvaan Vithlani, Technology Insights`,
    canonicalUrl: `https://yuvaanvithlani.com/blog/${postData.id}`,
    ogImage: postData.featuredImage || "/assets/Hero/Hero.webp"
  }),
  
  // Default fallback meta
  default: {
    title: "Yuvaan Vithlani - Web Designer & Developer Portfolio",
    description: "Yuvaan Vithlani - Web Designer & Developer creating beautiful, functional digital experiences. Explore my portfolio and get in touch for your next project.",
    keywords: "Yuvaan Vithlani, Web Designer, Developer, Portfolio, Digital Solutions",
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
    case '/blog':
      return metaConfigs.blog;
    case '/projects':
      return metaConfigs.projects;
    default:
      // Handle dynamic routes
      if (route.startsWith('/projects/') && data) {
        return metaConfigs.projectDetail(data);
      }
      if (route.startsWith('/blog/') && data) {
        return metaConfigs.blogPost(data);
      }
      return metaConfigs.default;
  }
};

export default metaConfigs;