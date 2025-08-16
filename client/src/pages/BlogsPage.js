import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { blogPosts } from '../data/blogData';
import { usePageNavigation } from '../hooks/usePageNavigation';
import { useLenisContext } from '../contexts/LenisContext';
import { useAnalytics } from '../hooks/useAnalytics';

function BlogsPage() {
  const [animationStage, setAnimationStage] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const { navigateWithTransition } = usePageNavigation();
  const { trackBlog, trackCTA, trackNavigation } = useAnalytics();

  // Get Lenis instance from context
  const lenis = useLenisContext();

  // Immediate scroll reset on component mount
  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Track blog page view
    trackBlog('view_list', null, null);
    
    // Immediately scroll to top - use both native and Lenis for reliability
    window.scrollTo(0, 0);
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }

    // Simplified animation timing to prevent glitches
    const timeouts = [
      setTimeout(() => setShowContent(true), 50),
      setTimeout(() => setAnimationStage(1), 200),
      setTimeout(() => setAnimationStage(2), 400),
      setTimeout(() => setAnimationStage(3), 600),
      setTimeout(() => setAnimationStage(4), 800),
    ];

    return () => timeouts.forEach(clearTimeout);
  }, [lenis, trackBlog]);

  // Enhanced topic color mapping
  const getTopicStyle = (topic) => {
    const topicStyles = {
      'Technology': { bg: '#A8977A', text: '#45372B' },
      'Design': { bg: '#E8B85C', text: '#45372B' },
      'Business': { bg: '#8FA675', text: '#45372B' },
      'Lifestyle': { bg: '#C79B7A', text: '#45372B' },
      'Travel': { bg: '#9AAFB5', text: '#45372B' },
      'default': { bg: '#A8977A', text: '#45372B' }
    };
    return topicStyles[topic] || topicStyles.default;
  };

  return (
    <>
      <div className={`page-transition ${showContent ? 'loaded' : ''}`} />
      
      <Navbar />
      
      <div className="pt-24 min-h-screen" style={{ backgroundColor: '#45372B' }}>
        {/* Desktop Layout - Enhanced Grid */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 mx-6 mt-0">
            {blogPosts.map((post, index) => {
              const topicStyle = getTopicStyle(post.topic);
              const isHovered = hoveredCard === post.id;
              
              return (
                <div
                  key={post.id}
                  className={`${animationStage >= 1 ? 'animate-fade-scale-in' : 'animate-hidden'} 
                    relative group`}
                  style={{ animationDelay: `${(index + 1) * 150}ms` }}
                  onMouseEnter={() => setHoveredCard(post.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Glow effect on hover */}
                  <div 
                    className={`absolute -inset-1 bg-gradient-to-r from-[#A8977A]/20 via-[#E8B85C]/20 to-[#A8977A]/20 
                      rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 
                      ${isHovered ? 'scale-105' : 'scale-100'}`}
                  />
                  
                  <div
                    className="relative rounded-2xl shadow-xl h-[520px] p-0 cursor-pointer 
                      transition-all duration-500 ease-out overflow-hidden
                      group-hover:shadow-2xl group-hover:shadow-[#A8977A]/10
                      border border-[#A8977A]/10 group-hover:border-[#A8977A]/30"
                    style={{ backgroundColor: '#161711' }}
                    onClick={() => {
                      trackBlog('click_post', post.id, post.title);
                      trackCTA('blog_post_click', 'blog_navigation', {
                        blogId: post.id,
                        blogTitle: post.title,
                        blogTopic: post.topic,
                        position: index + 1,
                        currentPage: window.location.pathname
                      });
                      trackNavigation(window.location.pathname, `/blog/${post.id}`, 'blog_card_click');
                      navigateWithTransition(`/blog/${post.id}`, 'up');
                    }}
                  >
                    {/* Enhanced Image Container with Overlay */}
                    <div className="relative w-full h-[240px] overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 
                          group-hover:scale-110"
                      />
                      
                      {/* Image overlay gradients */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#161711]/80 via-transparent to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-br from-[#A8977A]/10 via-transparent to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Floating topic badge */}
                      <div 
                        className="absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-medium
                          backdrop-blur-sm border border-white/20 shadow-lg
                          transform transition-all duration-300 group-hover:scale-105"
                        style={{ 
                          backgroundColor: `${topicStyle.bg}E6`,
                          color: topicStyle.text 
                        }}
                      >
                        {post.topic}
                      </div>

                      {/* Enhanced Arrow with animation */}
                      <div className="absolute top-4 right-4">
                        <div className="w-10 h-10 rounded-full bg-[#161711]/80 backdrop-blur-sm 
                          border border-[#A8977A]/30 flex items-center justify-center
                          transition-all duration-300 group-hover:bg-[#A8977A] 
                          group-hover:border-[#A8977A] group-hover:scale-110 group-hover:rotate-12">
                          <svg
                            className="w-5 h-5 text-[#A8977A] transition-all duration-300 
                              group-hover:text-[#45372B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 17L17 7M17 7H7M17 7V17"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Content Section */}
                    <div className="p-6 space-y-4 h-[280px] flex flex-col justify-between">
                      <div className="space-y-4">
                        {/* Enhanced Meta Row with better spacing */}
                        <div className="flex items-center gap-4 text-[#A8977A]/60 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#A8977A]/60" />
                            <span style={{ fontFamily: 'Neuton, serif' }}>{post.date}</span>
                          </div>
                          <span className="text-[#A8977A]/40">•</span>
                          <span style={{ fontFamily: 'Neuton, serif' }}>{post.readTime}</span>
                          {post.author && (
                            <>
                              <span className="text-[#A8977A]/40">•</span>
                              <span style={{ fontFamily: 'Neuton, serif' }}>by {post.author}</span>
                            </>
                          )}
                        </div>

                        {/* Enhanced Title with better hover effect */}
                        <h3 className="text-xl font-bold text-[#A8977A] leading-tight 
                          transition-all duration-300 group-hover:text-white 
                          group-hover:translate-y-[-2px]" 
                          style={{ fontFamily: 'Syne, sans-serif' }}>
                          {post.title}
                        </h3>

                        {/* Enhanced Description with fade effect */}
                        <p className="text-[#A8977A]/80 leading-relaxed line-clamp-3
                          transition-all duration-300 group-hover:text-[#A8977A]/90" 
                          style={{ fontFamily: 'Neuton, serif' }}>
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Enhanced Read More Section */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#A8977A]/10
                        group-hover:border-[#A8977A]/20 transition-colors duration-300">
                        <span className="text-[#A8977A]/60 text-sm font-medium 
                          transition-all duration-300 group-hover:text-[#A8977A]
                          group-hover:translate-x-1" 
                          style={{ fontFamily: 'Neuton, serif' }}>
                          Continue reading
                        </span>
                        
                        <div className="flex items-center text-[#A8977A]/60 text-sm 
                          transition-all duration-300 group-hover:text-[#A8977A]">
                          <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#A8977A]/30 
                            group-hover:to-[#A8977A]/60 transition-all duration-300 mr-2" />
                          <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Mobile Layout */}
        <div className="lg:hidden px-4 space-y-6 pb-6">
          {blogPosts.map((post, index) => {
            const topicStyle = getTopicStyle(post.topic);
            
            return (
              <div
                key={post.id}
                className={`${animationStage >= 1 ? 'animate-slide-up-fade' : 'animate-hidden'} 
                  relative group`}
                style={{ animationDelay: `${(index + 1) * 150}ms` }}
              >
                {/* Mobile glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#A8977A]/10 to-[#E8B85C]/10 
                  rounded-3xl blur-lg opacity-0 group-active:opacity-100 transition-opacity duration-300" />
                
                <div
                  className="relative rounded-2xl shadow-lg h-[420px] p-0 cursor-pointer
                    transition-all duration-300 overflow-hidden
                    border border-[#A8977A]/10 active:border-[#A8977A]/30
                    active:shadow-xl active:shadow-[#A8977A]/20"
                  style={{ backgroundColor: '#161711' }}
                  onClick={() => {
                    trackBlog('click_post', post.id, post.title);
                    trackCTA('blog_post_click_mobile', 'blog_navigation', {
                      blogId: post.id,
                      blogTitle: post.title,
                      blogTopic: post.topic,
                      position: index + 1,
                      currentPage: window.location.pathname,
                      context: 'mobile'
                    });
                    trackNavigation(window.location.pathname, `/blog/${post.id}`, 'blog_card_click_mobile');
                    navigateWithTransition(`/blog/${post.id}`, 'up');
                  }}
                >
                  {/* Mobile Image Container */}
                  <div className="relative w-full h-[200px] overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 
                        group-active:scale-105"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161711]/60 via-transparent to-transparent" />
                    
                    {/* Mobile topic badge */}
                    <div 
                      className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-medium
                        backdrop-blur-sm border border-white/20"
                      style={{ 
                        backgroundColor: `${topicStyle.bg}E6`,
                        color: topicStyle.text 
                      }}
                    >
                      {post.topic}
                    </div>

                    {/* Mobile arrow */}
                    <div className="absolute top-3 right-3">
                      <div className="w-8 h-8 rounded-full bg-[#161711]/80 backdrop-blur-sm 
                        border border-[#A8977A]/30 flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#A8977A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Content */}
                  <div className="p-5 space-y-3 h-[220px] flex flex-col justify-between">
                    <div className="space-y-3">
                      {/* Mobile meta */}
                      <div className="flex items-center gap-3 text-[#A8977A]/60 text-xs">
                        <span style={{ fontFamily: 'Neuton, serif' }}>{post.date}</span>
                        <span>•</span>
                        <span style={{ fontFamily: 'Neuton, serif' }}>{post.readTime}</span>
                      </div>

                      {/* Mobile title */}
                      <h3 className="text-lg font-bold text-[#A8977A] leading-tight" 
                        style={{ fontFamily: 'Syne, sans-serif' }}>
                        {post.title}
                      </h3>

                      {/* Mobile description */}
                      <p className="text-[#A8977A]/80 leading-relaxed text-sm line-clamp-3" 
                        style={{ fontFamily: 'Neuton, serif' }}>
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Mobile read more */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#A8977A]/10">
                      <span className="text-[#A8977A]/60 text-xs font-medium" 
                        style={{ fontFamily: 'Neuton, serif' }}>
                        Read more
                      </span>
                      <svg className="w-4 h-4 text-[#A8977A]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default BlogsPage;