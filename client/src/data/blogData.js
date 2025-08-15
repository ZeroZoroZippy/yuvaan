// Blog data with comprehensive posts
export const blogPosts = [
  {
    id: 1,
    title: "Building Modern Web Applications with React",
    excerpt: "Exploring the latest patterns and best practices for creating scalable React applications in 2024.",
    content: `
# Building Modern Web Applications with React

React continues to evolve, and with it, the patterns and practices we use to build modern web applications. In this post, we'll explore some of the latest approaches to creating scalable, maintainable React applications.

## Key Concepts

### Component Architecture
Modern React applications benefit from a well-thought-out component architecture. Consider these patterns:

- **Composition over inheritance**: Use component composition to build flexible UIs
- **Custom hooks**: Extract reusable logic into custom hooks
- **Context for state management**: Use React Context for global state when appropriate

### Performance Optimization
- **React.memo**: Prevent unnecessary re-renders
- **useMemo and useCallback**: Optimize expensive calculations and function references
- **Code splitting**: Use React.lazy for route-based code splitting

## Best Practices

1. Keep components small and focused
2. Use TypeScript for better developer experience
3. Implement proper error boundaries
4. Write comprehensive tests

Building modern React applications requires balancing performance, maintainability, and developer experience. By following these patterns, you can create applications that scale well and are enjoyable to work with.
    `,
    author: "Yuvaan Vithlani",
    date: "Jan 15, 2024",
    readTime: "5 min",
    topic: "React",
    tags: ["React", "JavaScript", "Web Development"],
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80"
  },
  {
    id: 2,
    title: "The Future of CSS: Container Queries and Beyond",
    excerpt: "Discover how container queries are revolutionizing responsive design and what other CSS features are on the horizon.",
    content: `
# The Future of CSS: Container Queries and Beyond

CSS continues to evolve at a rapid pace, bringing us powerful new features that change how we approach web design. Container queries represent one of the most significant additions to CSS in recent years.

## Container Queries: A Game Changer

Container queries allow components to respond to their container's size rather than the viewport size. This enables truly modular, responsive components.

\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: flex;
    gap: 1rem;
  }
}
\`\`\`

## Other Exciting CSS Features

### CSS Grid Subgrid
Subgrid allows nested grids to participate in their parent's grid, solving many layout challenges.

### CSS Cascade Layers
Cascade layers provide better control over CSS specificity and the cascade.

### New Color Functions
Modern color functions like \`oklch()\` and \`color-mix()\` offer better color manipulation.

The future of CSS is bright, with these features enabling more sophisticated and maintainable stylesheets.
    `,
    author: "Yuvaan Vithlani",
    date: "Jan 10, 2024",
    readTime: "4 min",
    topic: "CSS",
    tags: ["CSS", "Web Design", "Frontend"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80"
  },
  {
    id: 3,
    title: "Mastering JavaScript Async Patterns",
    excerpt: "A deep dive into promises, async/await, and advanced asynchronous programming patterns in JavaScript.",
    content: `
# Mastering JavaScript Async Patterns

Asynchronous programming is at the heart of modern JavaScript development. Understanding these patterns is crucial for building responsive applications.

## Evolution of Async JavaScript

### Callbacks
The original async pattern, but prone to callback hell:

\`\`\`javascript
getData(function(a) {
  getMoreData(a, function(b) {
    getEvenMoreData(b, function(c) {
      // Callback hell
    });
  });
});
\`\`\`

### Promises
A cleaner approach with better error handling:

\`\`\`javascript
getData()
  .then(a => getMoreData(a))
  .then(b => getEvenMoreData(b))
  .then(c => console.log(c))
  .catch(error => console.error(error));
\`\`\`

### Async/Await
The most readable async pattern:

\`\`\`javascript
async function fetchData() {
  try {
    const a = await getData();
    const b = await getMoreData(a);
    const c = await getEvenMoreData(b);
    console.log(c);
  } catch (error) {
    console.error(error);
  }
}
\`\`\`

## Advanced Patterns

- **Promise.all()**: Run multiple async operations concurrently
- **Promise.race()**: Get the first resolved promise
- **AbortController**: Cancel async operations
- **Async iterators**: Handle streams of async data

Mastering these patterns will make you a more effective JavaScript developer.
    `,
    author: "Yuvaan Vithlani",
    date: "Jan 5, 2024",
    readTime: "6 min",
    topic: "JavaScript",
    tags: ["JavaScript", "Async", "Programming"],
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80"
  },
  {
    id: 4,
    title: "UI/UX Design Principles for Developers",
    excerpt: "Essential design principles every developer should know to create better user experiences and interfaces.",
    content: `
# UI/UX Design Principles for Developers

As developers, understanding design principles helps us create better user experiences. Here are the fundamental concepts that bridge the gap between development and design.

## Core Design Principles

### Visual Hierarchy
Guide users through your interface with clear visual hierarchy:

- **Size and scale**: Larger elements draw more attention
- **Color and contrast**: Use color to highlight important elements
- **Typography**: Different font weights and sizes create hierarchy
- **Spacing**: White space helps organize content

### Consistency
Maintain consistency across your application:

- **Design patterns**: Use consistent layouts and components
- **Color palette**: Stick to a defined color scheme
- **Typography**: Limit font families and establish a type scale
- **Interactions**: Keep user interactions predictable

## User Experience Fundamentals

### Usability Heuristics
Jakob Nielsen's 10 usability heuristics remain relevant:

1. Visibility of system status
2. Match between system and real world
3. User control and freedom
4. Consistency and standards
5. Error prevention

### Accessibility
Design for everyone:

- **Color contrast**: Ensure sufficient contrast ratios
- **Keyboard navigation**: Make interfaces keyboard accessible
- **Screen readers**: Use semantic HTML and ARIA labels
- **Focus indicators**: Provide clear focus states

## Practical Implementation

### Design Systems
Create reusable components and patterns:

- **Component library**: Build a consistent set of UI components
- **Style guide**: Document colors, typography, and spacing
- **Design tokens**: Use variables for consistent styling

Good design isn't just about aesthetics—it's about creating intuitive, accessible experiences that users love.
    `,
    author: "Yuvaan Vithlani",
    date: "Dec 28, 2023",
    readTime: "7 min",
    topic: "Design",
    tags: ["UI/UX", "Design", "Frontend"],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80"
  },
  {
    id: 5,
    title: "Full-Stack Development with Node.js and Express",
    excerpt: "Building robust backend APIs with Node.js, Express, and modern development practices for scalable applications.",
    content: `
# Full-Stack Development with Node.js and Express

Node.js has revolutionized server-side JavaScript development. Combined with Express, it provides a powerful foundation for building scalable web applications and APIs.

## Setting Up Your Environment

### Project Structure
Organize your Node.js project for maintainability:

\`\`\`
project/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── utils/
├── tests/
├── package.json
└── server.js
\`\`\`

### Essential Dependencies
Key packages for modern Node.js development:

- **Express**: Web framework
- **Mongoose**: MongoDB object modeling
- **JWT**: Authentication tokens
- **Helmet**: Security middleware
- **Cors**: Cross-origin resource sharing

## Building RESTful APIs

### Route Organization
Structure your routes for clarity:

\`\`\`javascript
// routes/users.js
const express = require('express');
const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
\`\`\`

### Middleware Implementation
Create reusable middleware functions:

\`\`\`javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};
\`\`\`

## Database Integration

### MongoDB with Mongoose
Define schemas and models:

\`\`\`javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
\`\`\`

## Best Practices

### Error Handling
Implement comprehensive error handling:

- **Global error middleware**: Catch and handle all errors
- **Async error handling**: Use try-catch with async/await
- **Validation**: Validate input data before processing
- **Logging**: Log errors for debugging and monitoring

### Security
Secure your Node.js applications:

- **Environment variables**: Store sensitive data in .env files
- **Input validation**: Sanitize and validate all inputs
- **Rate limiting**: Prevent abuse with rate limiting
- **HTTPS**: Always use HTTPS in production

Node.js and Express provide a solid foundation for building modern web applications. Focus on clean architecture, security, and performance for production-ready applications.
    `,
    author: "Yuvaan Vithlani",
    date: "Dec 20, 2023",
    readTime: "8 min",
    topic: "Backend",
    tags: ["Node.js", "Express", "Backend"],
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80"
  },
  {
    id: 6,
    title: "Web Performance Optimization Techniques",
    excerpt: "Comprehensive guide to optimizing web performance, from loading times to runtime efficiency and user experience.",
    content: `
# Web Performance Optimization Techniques

Web performance directly impacts user experience, SEO rankings, and conversion rates. Here's a comprehensive guide to optimizing your web applications for speed and efficiency.

## Core Web Vitals

### Understanding the Metrics
Google's Core Web Vitals focus on three key aspects:

- **Largest Contentful Paint (LCP)**: Loading performance
- **First Input Delay (FID)**: Interactivity
- **Cumulative Layout Shift (CLS)**: Visual stability

### Measuring Performance
Tools for performance measurement:

- **Lighthouse**: Comprehensive auditing tool
- **WebPageTest**: Detailed performance analysis
- **Chrome DevTools**: Real-time performance monitoring
- **Real User Monitoring (RUM)**: Production performance data

## Loading Optimization

### Image Optimization
Images often account for the majority of page weight:

\`\`\`html
<!-- Modern image formats -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.avif" type="image/avif">
  <img src="image.jpg" alt="Description" loading="lazy">
</picture>
\`\`\`

### Code Splitting
Break your JavaScript into smaller chunks:

\`\`\`javascript
// Dynamic imports for code splitting
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// Route-based splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
\`\`\`

### Resource Optimization
Optimize your assets:

- **Minification**: Compress CSS, JavaScript, and HTML
- **Compression**: Enable gzip or Brotli compression
- **Caching**: Implement proper cache headers
- **CDN**: Use Content Delivery Networks for static assets

## Runtime Performance

### JavaScript Optimization
Optimize your JavaScript execution:

\`\`\`javascript
// Debounce expensive operations
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Use requestAnimationFrame for animations
const animate = () => {
  // Animation logic
  requestAnimationFrame(animate);
};
\`\`\`

### Memory Management
Prevent memory leaks:

- **Event listeners**: Remove unused event listeners
- **Timers**: Clear intervals and timeouts
- **DOM references**: Avoid holding references to removed DOM elements
- **Closures**: Be mindful of closure scope

## CSS Performance

### Efficient Selectors
Write performant CSS:

\`\`\`css
/* Efficient - ID and class selectors */
#header { }
.navigation { }

/* Less efficient - complex selectors */
div > ul > li > a { }
\`\`\`

### Critical CSS
Inline critical CSS for above-the-fold content:

- **Extract critical CSS**: Identify styles needed for initial render
- **Inline critical styles**: Include in HTML head
- **Defer non-critical CSS**: Load remaining styles asynchronously

## Network Optimization

### HTTP/2 and HTTP/3
Leverage modern protocols:

- **Multiplexing**: Multiple requests over single connection
- **Server Push**: Proactively send resources
- **Header compression**: Reduce overhead

### Preloading Strategies
Optimize resource loading:

\`\`\`html
<!-- Preload critical resources -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>

<!-- Prefetch likely next resources -->
<link rel="prefetch" href="/next-page.html">

<!-- DNS prefetch for external domains -->
<link rel="dns-prefetch" href="//external-api.com">
\`\`\`

## Monitoring and Maintenance

### Performance Budgets
Set and enforce performance budgets:

- **Size budgets**: Limit bundle sizes
- **Timing budgets**: Set performance thresholds
- **Automated monitoring**: Fail builds that exceed budgets

Performance optimization is an ongoing process. Regular monitoring and optimization ensure your applications remain fast and user-friendly as they grow and evolve.
    `,
    author: "Yuvaan Vithlani",
    date: "Dec 15, 2023",
    readTime: "9 min",
    topic: "Performance",
    tags: ["Performance", "Optimization", "Web Development"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80"
  }
];

export const getBlogPost = (id) => {
  return blogPosts.find(post => post.id === parseInt(id));
};

export const getRecentPosts = (limit = 3) => {
  return blogPosts
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
};