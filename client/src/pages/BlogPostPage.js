import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getBlogPost, getRecentPosts } from '../data/blogData';
import { usePageNavigation } from '../hooks/usePageNavigation';
import { useLenisContext } from '../contexts/LenisContext';

function BlogPostPage() {
  const { id } = useParams();
  const [animationStage, setAnimationStage] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const { navigateWithTransition } = usePageNavigation();

  const post = getBlogPost(id);
  const recentPosts = getRecentPosts().filter(p => p.id !== parseInt(id));

  // Get Lenis instance from context
  const lenis = useLenisContext();

  // Immediate scroll reset on component mount/ID change
  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    // Reset animation states when blog ID changes
    setAnimationStage(0);
    setShowContent(false);
    setReadingProgress(0);
    setIsScrolled(false);

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

    // Reading progress tracker using Lenis scroll event
    const handleScroll = ({ scroll }) => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scroll / docHeight;
      setReadingProgress(Math.min(scrollPercent * 100, 100));
      setIsScrolled(scroll > 100);
    };

    // Use Lenis scroll event for better integration
    if (lenis) {
      lenis.on('scroll', handleScroll);
    }

    return () => {
      timeouts.forEach(clearTimeout);
      if (lenis) {
        lenis.off('scroll', handleScroll);
      }
    };
  }, [id, lenis]);

  // If post not found, redirect to blogs page
  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  // Enhanced topic color mapping
  const getTopicStyle = (topic) => {
    const topicStyles = {
      'Technology': { bg: '#A8977A', text: '#45372B', accent: '#E8B85C' },
      'Design': { bg: '#E8B85C', text: '#45372B', accent: '#A8977A' },
      'Business': { bg: '#8FA675', text: '#45372B', accent: '#A8977A' },
      'Lifestyle': { bg: '#C79B7A', text: '#45372B', accent: '#A8977A' },
      'Travel': { bg: '#9AAFB5', text: '#45372B', accent: '#A8977A' },
      'default': { bg: '#A8977A', text: '#45372B', accent: '#E8B85C' }
    };
    return topicStyles[topic] || topicStyles.default;
  };

  const topicStyle = getTopicStyle(post.topic);

  // Enhanced markdown parser for better text formatting
  const parseMarkdown = (text) => {
    // Handle code blocks first (to avoid conflicts)
    text = text.replace(/```([^`]+)```/g, '<pre class="bg-[#161711] border border-[#A8977A]/20 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-[#A8977A] text-sm">$1</code></pre>');

    // Handle inline code
    text = text.replace(/`([^`]+)`/g, '<code class="bg-[#A8977A]/10 text-[#A8977A] px-2 py-1 rounded text-sm border border-[#A8977A]/20">$1</code>');

    // Handle bold text
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-[#A8977A]">$1</strong>');

    // Handle italic text
    text = text.replace(/\*([^*]+)\*/g, '<em class="italic text-[#A8977A]/90">$1</em>');

    // Handle links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#A8977A] underline hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">$1</a>');

    return text;
  };

  // Enhanced content renderer with better typography and markdown support
  const renderContent = (content) => {
    return content.split('\n').map((line, index) => {
      // Headers with enhanced styling
      if (line.startsWith('# ')) {
        return (
          <h1 key={index} className="text-4xl font-bold text-[#A8977A] mb-8 mt-12 
            relative before:content-[''] before:absolute before:left-0 before:bottom-[-8px] 
            before:w-16 before:h-1 before:bg-gradient-to-r before:from-[#A8977A] before:to-[#E8B85C] 
            before:rounded-full"
            style={{ fontFamily: 'Syne, sans-serif' }}
            dangerouslySetInnerHTML={{ __html: parseMarkdown(line.slice(2)) }}>
          </h1>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-3xl font-bold text-[#A8977A] mb-6 mt-10 
            relative before:content-[''] before:absolute before:left-0 before:bottom-[-6px] 
            before:w-12 before:h-0.5 before:bg-[#A8977A] before:rounded-full"
            style={{ fontFamily: 'Syne, sans-serif' }}
            dangerouslySetInnerHTML={{ __html: parseMarkdown(line.slice(3)) }}>
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-2xl font-bold text-[#A8977A] mb-4 mt-8"
            style={{ fontFamily: 'Syne, sans-serif' }}
            dangerouslySetInnerHTML={{ __html: parseMarkdown(line.slice(4)) }}>
          </h3>
        );
      }

      // Enhanced quote blocks
      if (line.startsWith('> ')) {
        return (
          <blockquote key={index} className="border-l-4 border-[#A8977A] pl-6 my-6 
            bg-[#A8977A]/5 py-4 rounded-r-lg italic text-[#A8977A]/90 text-lg">
            <p style={{ fontFamily: 'Neuton, serif' }}
              dangerouslySetInnerHTML={{ __html: parseMarkdown(line.slice(2)) }}>
            </p>
          </blockquote>
        );
      }

      // Enhanced lists with better styling
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="text-[#A8977A] mb-3 ml-6 relative 
            before:content-[''] before:absolute before:left-[-20px] before:top-[10px] 
            before:w-2 before:h-2 before:bg-[#A8977A] before:rounded-full"
            style={{ fontFamily: 'Neuton, serif' }}
            dangerouslySetInnerHTML={{ __html: parseMarkdown(line.slice(2)) }}>
          </li>
        );
      }

      // Numbered lists with enhanced styling
      if (/^\d+\.\s/.test(line)) {
        const number = line.match(/^(\d+)\./)[1];
        const content = line.replace(/^\d+\.\s/, '');
        return (
          <li key={index} className="text-[#A8977A] mb-3 ml-8 relative" style={{ fontFamily: 'Neuton, serif' }}>
            <span className="absolute left-[-32px] top-0 w-6 h-6 bg-[#A8977A] text-[#45372B] 
              rounded-full flex items-center justify-center text-sm font-bold">
              {number}
            </span>
            <span dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}></span>
          </li>
        );
      }

      // Empty lines for spacing
      if (line.trim() === '') {
        return <div key={index} className="h-4" />;
      }

      // Enhanced paragraphs with better spacing and typography
      return (
        <p key={index} className="text-[#A8977A]/90 mb-6 leading-relaxed text-lg 
          hover:text-[#A8977A] transition-colors duration-300"
          style={{ fontFamily: 'Neuton, serif' }}
          dangerouslySetInnerHTML={{ __html: parseMarkdown(line) }}>
        </p>
      );
    });
  };

  return (
    <>
      <div className={`page-transition ${showContent ? 'loaded' : ''}`} />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-[#45372B]/50 z-50">
        <div
          className="h-full bg-gradient-to-r from-[#A8977A] to-[#E8B85C] transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <Navbar />

      {/* Floating Back Button */}
      <div className={`fixed top-28 right-6 z-40 transition-all duration-300 ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <button
          onClick={() => navigateWithTransition('/blog', 'down')}
          className="w-12 h-12 bg-[#161711] border-2 border-[#A8977A]/30 rounded-full 
            flex items-center justify-center backdrop-blur-sm shadow-lg
            hover:bg-[#A8977A] hover:border-[#A8977A] hover:scale-110 
            transition-all duration-300 group"
        >
          <svg className="w-5 h-5 text-[#A8977A] group-hover:text-[#45372B] transition-colors"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>

      <div className="pt-24 min-h-screen" style={{ backgroundColor: '#45372B' }}>
        {/* Desktop Layout */}
        <div className="hidden lg:block max-w-6xl mx-auto px-6">
          {/* Hero Section */}
          <div className={`${animationStage >= 1 ? 'animate-fade-scale-in' : 'animate-hidden'} mb-8`}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ height: '500px' }}>
              {/* Hero Background Image */}
              <div className="absolute inset-0">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161711] via-[#161711]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#A8977A]/10 via-transparent to-[#E8B85C]/10" />
              </div>

              {/* Hero Content */}
              <div className="relative h-full flex flex-col justify-end p-12">
                {/* Topic Badge */}
                <div className="mb-6">
                  <span
                    className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium
                      backdrop-blur-sm border shadow-lg"
                    style={{
                      backgroundColor: `${topicStyle.bg}E6`,
                      color: topicStyle.text,
                      borderColor: `${topicStyle.bg}66`
                    }}
                  >
                    <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: topicStyle.accent }} />
                    {post.topic}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-5xl font-bold text-white leading-tight mb-6 max-w-4xl"
                  style={{ fontFamily: 'Syne, sans-serif' }}>
                  {post.title}
                </h1>

                {/* Meta Information */}
                <div className="flex items-center gap-6 text-[#A8977A]/80">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#A8977A] flex items-center justify-center">
                      <span className="text-[#45372B] font-bold text-sm">
                        {post.author?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <span style={{ fontFamily: 'Neuton, serif' }}>By {post.author}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span style={{ fontFamily: 'Neuton, serif' }}>{post.date}</span>
                    <span>•</span>
                    <span style={{ fontFamily: 'Neuton, serif' }}>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-12 gap-8">
            {/* Article Content */}
            <div className="col-span-8">
              {/* Article Preview Card */}
              <div className={`${animationStage >= 2 ? 'animate-fade-scale-in' : 'animate-hidden'} mb-8`}>
                <div className="rounded-2xl p-8 shadow-lg border border-[#A8977A]/10"
                  style={{ backgroundColor: '#161711' }}>
                  <h2 className="text-2xl font-bold text-[#A8977A] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
                    Article Summary
                  </h2>
                  <p className="text-[#A8977A]/80 leading-relaxed text-lg" style={{ fontFamily: 'Neuton, serif' }}>
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Main Article Content */}
              <div className={`${animationStage >= 3 ? 'animate-fade-scale-in' : 'animate-hidden'}`}>
                <article className="rounded-2xl p-8 shadow-lg border border-[#A8977A]/10"
                  style={{ backgroundColor: '#161711' }}>
                  <div className="prose prose-lg max-w-none">
                    {renderContent(post.content)}
                  </div>

                  {/* Tags Section */}
                  <div className="mt-12 pt-8 border-t border-[#A8977A]/20">
                    <h3 className="text-lg font-bold text-[#A8977A] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {post.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-[#A8977A]/10 border border-[#A8977A]/30 
                            text-[#A8977A] text-sm rounded-full hover:bg-[#A8977A] 
                            hover:text-[#45372B] transition-all duration-300 cursor-pointer"
                          style={{ fontFamily: 'Neuton, serif' }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-span-4">
              {/* Table of Contents (if headers exist) */}
              <div className={`${animationStage >= 2 ? 'animate-fade-scale-in' : 'animate-hidden'} mb-8 sticky top-28`}>
                <div className="rounded-2xl p-6 shadow-lg border border-[#A8977A]/10"
                  style={{ backgroundColor: '#A8977A' }}>
                  <h3 className="text-xl font-bold text-[#45372B] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
                    Quick Navigation
                  </h3>

                  {/* Share Buttons */}
                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#161711] 
                      text-[#A8977A] rounded-lg hover:bg-[#45372B] transition-colors duration-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                      </svg>
                      <span style={{ fontFamily: 'Neuton, serif' }}>Share on Facebook</span>
                    </button>

                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#161711] 
                      text-[#A8977A] rounded-lg hover:bg-[#45372B] transition-colors duration-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                      <span style={{ fontFamily: 'Neuton, serif' }}>Share on Twitter</span>
                    </button>

                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#161711] 
                      text-[#A8977A] rounded-lg hover:bg-[#45372B] transition-colors duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      <span style={{ fontFamily: 'Neuton, serif' }}>Copy Link</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {recentPosts.length > 0 && (
            <div className="mt-16">
              <div className={`${animationStage >= 4 ? 'animate-fade-scale-in' : 'animate-hidden'}`}>
                <div className="rounded-2xl p-8 shadow-lg border border-[#A8977A]/10"
                  style={{ backgroundColor: '#161711' }}>
                  <h2 className="text-3xl font-bold text-[#A8977A] mb-8" style={{ fontFamily: 'Syne, sans-serif' }}>
                    Continue Reading
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recentPosts.slice(0, 2).map((relatedPost) => (
                      <div
                        key={relatedPost.id}
                        className="group relative rounded-xl overflow-hidden cursor-pointer 
                          hover:scale-105 transition-all duration-500 shadow-lg"
                        onClick={() => navigateWithTransition(`/blog/${relatedPost.id}`, 'up')}
                      >
                        {/* Related post image */}
                        <div className="aspect-[16/10] overflow-hidden">
                          <img
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#161711] via-transparent to-transparent" />
                        </div>

                        {/* Related post content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 
                            group-hover:text-[#A8977A] transition-colors duration-300"
                            style={{ fontFamily: 'Syne, sans-serif' }}>
                            {relatedPost.title}
                          </h3>
                          <p className="text-[#A8977A]/80 text-sm line-clamp-2 mb-3"
                            style={{ fontFamily: 'Neuton, serif' }}>
                            {relatedPost.excerpt}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-[#A8977A]/60">
                            <span>{relatedPost.date}</span>
                            <span>•</span>
                            <span>{relatedPost.readTime}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Mobile Layout */}
        <div className="lg:hidden px-4 space-y-6 pb-6">
          {/* Mobile Hero */}
          <div className={`${animationStage >= 1 ? 'animate-slide-up-fade' : 'animate-hidden'}`}>
            <div className="relative rounded-2xl overflow-hidden shadow-lg" style={{ height: '350px' }}>
              <div className="absolute inset-0">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161711] via-[#161711]/40 to-transparent" />
              </div>

              <div className="relative h-full flex flex-col justify-between p-6">
                {/* Back button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => navigateWithTransition('/blog', 'down')}
                    className="w-10 h-10 bg-[#161711]/80 border border-[#A8977A]/30 rounded-full 
                      flex items-center justify-center backdrop-blur-sm"
                  >
                    <svg className="w-5 h-5 text-[#A8977A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                </div>

                {/* Mobile hero content */}
                <div>
                  <div className="mb-4">
                    <span
                      className="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium
                        backdrop-blur-sm border"
                      style={{
                        backgroundColor: `${topicStyle.bg}E6`,
                        color: topicStyle.text,
                        borderColor: `${topicStyle.bg}66`
                      }}
                    >
                      {post.topic}
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold text-white leading-tight mb-4"
                    style={{ fontFamily: 'Syne, sans-serif' }}>
                    {post.title}
                  </h1>

                  <div className="flex items-center gap-3 text-[#A8977A]/80 text-sm">
                    <span>By {post.author}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile content sections follow similar pattern... */}
          {/* Content Preview Card */}
          <div className={`${animationStage >= 2 ? 'animate-slide-up-fade' : 'animate-hidden'}`}>
            <div className="rounded-2xl p-6 shadow-lg border border-[#A8977A]/10"
              style={{ backgroundColor: '#161711' }}>
              <h2 className="text-xl font-bold text-[#A8977A] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
                Article Summary
              </h2>
              <p className="text-[#A8977A]/80 leading-relaxed" style={{ fontFamily: 'Neuton, serif' }}>
                {post.excerpt}
              </p>
            </div>
          </div>

          {/* Mobile Full Content */}
          <div className={`${animationStage >= 3 ? 'animate-slide-up-fade' : 'animate-hidden'}`}>
            <div className="rounded-2xl p-6 shadow-lg border border-[#A8977A]/10"
              style={{ backgroundColor: '#161711' }}>
              <article className="prose max-w-none">
                {renderContent(post.content)}
              </article>

              {/* Mobile Tags */}
              <div className="mt-8 pt-6 border-t border-[#A8977A]/20">
                <h3 className="text-lg font-bold text-[#A8977A] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#A8977A]/10 border border-[#A8977A]/30 
                        text-[#A8977A] text-xs rounded-full"
                      style={{ fontFamily: 'Neuton, serif' }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Related Posts */}
          {recentPosts.length > 0 && (
            <div className={`${animationStage >= 4 ? 'animate-slide-up-fade' : 'animate-hidden'}`}>
              <div className="rounded-2xl p-6 shadow-lg border border-[#A8977A]/10"
                style={{ backgroundColor: '#161711' }}>
                <h2 className="text-xl font-bold text-[#A8977A] mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Continue Reading
                </h2>
                <div className="space-y-4">
                  {recentPosts.slice(0, 2).map((relatedPost) => (
                    <div
                      key={relatedPost.id}
                      className="relative rounded-xl overflow-hidden cursor-pointer shadow-md"
                      onClick={() => navigateWithTransition(`/blog/${relatedPost.id}`, 'up')}
                    >
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#161711] via-transparent to-transparent" />
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-base font-bold text-white mb-1 line-clamp-2"
                          style={{ fontFamily: 'Syne, sans-serif' }}>
                          {relatedPost.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-[#A8977A]/60">
                          <span>{relatedPost.date}</span>
                          <span>•</span>
                          <span>{relatedPost.readTime}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default BlogPostPage;