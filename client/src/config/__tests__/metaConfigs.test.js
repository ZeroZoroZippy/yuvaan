import { metaConfigs, getMetaConfig } from '../metaConfigs';

describe('Meta Configurations', () => {
  describe('Static Page Configurations', () => {
    test('home page meta config has required fields', () => {
      const homeConfig = metaConfigs.home;
      
      expect(homeConfig.title).toBeDefined();
      expect(homeConfig.description).toBeDefined();
      expect(homeConfig.keywords).toBeDefined();
      expect(homeConfig.canonicalUrl).toBeDefined();
      expect(homeConfig.ogImage).toBeDefined();
    });

    test('home page title meets SEO requirements', () => {
      const homeConfig = metaConfigs.home;
      
      expect(homeConfig.title).toBe("Yuvaan Vithlani - Product Systems & AI Portfolio");
      expect(homeConfig.title.length).toBeLessThanOrEqual(75); // Allow slightly longer for descriptive titles
      expect(homeConfig.title).toContain('Yuvaan Vithlani');
      expect(homeConfig.title).toContain('Product');
      expect(homeConfig.title).toContain('AI');
    });

    test('home page description meets SEO requirements', () => {
      const homeConfig = metaConfigs.home;
      
      expect(homeConfig.description).toBe("Portfolio of Yuvaan Vithlani, a product-minded systems thinker using user empathy and AI-assisted building to turn ambiguity into clear digital products.");
      expect(homeConfig.description.length).toBeLessThanOrEqual(160);
      expect(homeConfig.description.length).toBeGreaterThanOrEqual(100);
    });

    test('about page meta config is properly configured', () => {
      const aboutConfig = metaConfigs.about;
      
      expect(aboutConfig.title).toContain('About Yuvaan Vithlani');
      expect(aboutConfig.description).toContain('Learn how Yuvaan Vithlani works');
      expect(aboutConfig.canonicalUrl).toBe('https://yuvaanvithlani.com/about');
      expect(aboutConfig.title.length).toBeLessThanOrEqual(75); // Allow slightly longer for descriptive titles
      expect(aboutConfig.description.length).toBeLessThanOrEqual(160);
    });

    test('projects page meta config is properly configured', () => {
      const projectsConfig = metaConfigs.projects;
      
      expect(projectsConfig.title).toContain('Work - Yuvaan Vithlani');
      expect(projectsConfig.description).toContain('AI experiments');
      expect(projectsConfig.canonicalUrl).toBe('https://yuvaanvithlani.com/projects');
      expect(projectsConfig.title.length).toBeLessThanOrEqual(75);
      expect(projectsConfig.description.length).toBeLessThanOrEqual(160);
    });
  });

  describe('Dynamic Page Configurations', () => {
    test('project detail meta config generates correctly', () => {
      const projectData = {
        id: 'test-project',
        title: 'Test Project',
        description: 'A test project for validation',
        tags: ['AI', 'Product Thinking'],
        mainImage: '/test-image.jpg'
      };

      const config = metaConfigs.projectDetail(projectData);
      
      expect(config.title).toBe('Test Project - Work by Yuvaan Vithlani | Product & AI Portfolio');
      expect(config.description).toContain('A test project for validation');
      expect(config.description).toContain('Selected work by Yuvaan Vithlani');
      expect(config.canonicalUrl).toBe('https://yuvaanvithlani.com/projects/test-project');
      expect(config.ogImage).toBe('/test-image.jpg');
    });

    test('project detail meta config handles missing technologies', () => {
      const projectData = {
        id: 'simple-project',
        title: 'Simple Project',
        description: 'A simple project'
      };

      const config = metaConfigs.projectDetail(projectData);
      
      expect(config.description).toContain('Selected work by Yuvaan Vithlani');
      expect(config.ogImage).toBe('/assets/Projects/default-project.webp');
    });

  });

  describe('getMetaConfig Helper Function', () => {
    test('returns home config for root route', () => {
      const config = getMetaConfig('/');
      expect(config).toEqual(metaConfigs.home);
    });

    test('returns home config for /home route', () => {
      const config = getMetaConfig('/home');
      expect(config).toEqual(metaConfigs.home);
    });

    test('returns about config for /about route', () => {
      const config = getMetaConfig('/about');
      expect(config).toEqual(metaConfigs.about);
    });

    test('returns projects config for /projects route', () => {
      const config = getMetaConfig('/projects');
      expect(config).toEqual(metaConfigs.projects);
    });

    test('returns dynamic project config for project detail route', () => {
      const projectData = {
        id: 'test-project',
        title: 'Test Project',
        description: 'Test description'
      };
      
      const config = getMetaConfig('/projects/test-project', projectData);
      expect(config.title).toContain('Test Project - Work by Yuvaan Vithlani');
    });

    test('returns default config for unknown routes', () => {
      const config = getMetaConfig('/unknown-route');
      expect(config).toEqual(metaConfigs.default);
    });
  });

  describe('Character Limit Validation', () => {
    test('all static page titles are within SEO limits', () => {
      const pages = ['home', 'about', 'projects'];
      
      pages.forEach(page => {
        const config = metaConfigs[page];
        expect(config.title.length).toBeLessThanOrEqual(75); // Allow slightly longer for descriptive titles
        expect(config.title.length).toBeGreaterThan(10);
      });
    });

    test('all static page descriptions are within SEO limits', () => {
      const pages = ['home', 'about', 'projects'];
      
      pages.forEach(page => {
        const config = metaConfigs[page];
        expect(config.description.length).toBeLessThanOrEqual(160);
        expect(config.description.length).toBeGreaterThan(50);
      });
    });

    test('default config meets character limits', () => {
      const defaultConfig = metaConfigs.default;
      
      expect(defaultConfig.title.length).toBeLessThanOrEqual(60);
      expect(defaultConfig.description.length).toBeLessThanOrEqual(160);
    });
  });

  describe('Required Keywords Presence', () => {
    test('home page contains essential keywords', () => {
      const homeConfig = metaConfigs.home;
      
      expect(homeConfig.title.toLowerCase()).toContain('yuvaan vithlani');
      expect(homeConfig.title.toLowerCase()).toContain('product');
      expect(homeConfig.title.toLowerCase()).toContain('ai');
      expect(homeConfig.description.toLowerCase()).toContain('portfolio');
      expect(homeConfig.description.toLowerCase()).toContain('digital products');
    });

    test('all pages contain Yuvaan Vithlani name', () => {
      const pages = ['home', 'about', 'projects'];
      
      pages.forEach(page => {
        const config = metaConfigs[page];
        expect(config.title.toLowerCase()).toContain('yuvaan vithlani');
      });
    });

    test('canonical URLs are properly formatted', () => {
      const pages = ['home', 'about', 'projects'];
      
      pages.forEach(page => {
        const config = metaConfigs[page];
        expect(config.canonicalUrl).toMatch(/^https:\/\/yuvaanvithlani\.com/);
      });
    });
  });
});
