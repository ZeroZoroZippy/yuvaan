import React, { useState, useRef, useEffect } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  lazy = true,
  quality = 'high',
  sizes = '',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazy);
  const imgRef = useRef();

  const getOptimizedSrc = (originalSrc) => {
    // If already optimized, return as-is
    if (originalSrc.includes('/assets-optimized/')) {
      return originalSrc;
    }
    // Convert to optimized path
    return originalSrc.replace('/assets/', '/assets-optimized/');
  };

  const getWebPSrc = (originalSrc) => {
    const optimizedSrc = getOptimizedSrc(originalSrc);
    return optimizedSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  };

  useEffect(() => {
    if (!lazy || !imgRef.current) return;

    const currentRef = imgRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '50px'
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [lazy]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      ref={imgRef} 
      className={`${className} ${!isLoaded ? 'bg-gray-200 animate-pulse' : ''}`}
      {...props}
    >
      {isVisible && (
        <picture>
          <source srcSet={getWebPSrc(src)} type="image/webp" />
          <img
            src={getOptimizedSrc(src)}
            alt={alt}
            className={`w-full h-full transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            loading={lazy ? 'lazy' : 'eager'}
            decoding="async"
            sizes={sizes}
          />
        </picture>
      )}
    </div>
  );
};

export default OptimizedImage;