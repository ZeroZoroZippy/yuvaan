import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

const MetaManager = ({ 
  title, 
  description, 
  keywords = '', 
  canonicalUrl = '', 
  ogImage = '',
  children 
}) => {
  // Memoize expensive computations to prevent unnecessary re-renders
  const metaData = useMemo(() => {
    // Construct full title with site name
    const fullTitle = title.includes('Yuvaan Vithlani') ? title : `${title} | Yuvaan Vithlani`;
    
    // Get current URL for canonical and og:url (only compute once)
    const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');
    
    // Default OG image if none provided
    const defaultOgImage = '/assets/Hero/Hero.webp';
    const ogImageUrl = ogImage || defaultOgImage;

    return {
      fullTitle,
      currentUrl,
      ogImageUrl
    };
  }, [title, canonicalUrl, ogImage]);

  // Memoize structured data to prevent JSON.stringify on every render
  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Yuvaan Vithlani",
    "jobTitle": "Web Designer & Developer",
    "description": "Web Designer & Developer creating beautiful, functional digital experiences",
    "url": "https://yuvaanvithlani.com",
    "sameAs": [
      // Add social media URLs when available
    ],
    "knowsAbout": ["Web Development", "UI/UX Design", "React", "JavaScript", "Frontend Development"]
  }), []);

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{metaData.fullTitle}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        <meta name="author" content="Yuvaan Vithlani" />
        
        {/* Canonical URL */}
        {metaData.currentUrl && <link rel="canonical" href={metaData.currentUrl} />}
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={metaData.fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        {metaData.currentUrl && <meta property="og:url" content={metaData.currentUrl} />}
        <meta property="og:image" content={metaData.ogImageUrl} />
        <meta property="og:site_name" content="Yuvaan Vithlani Portfolio" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaData.fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={metaData.ogImageUrl} />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        
        {/* Structured Data for Person/Professional */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      {children}
    </>
  );
};

export default MetaManager;