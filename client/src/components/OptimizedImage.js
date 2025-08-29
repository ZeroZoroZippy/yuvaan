import React from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  lazy = true,
  ...props 
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={lazy ? 'lazy' : 'eager'}
      {...props}
    />
  );
};

export default OptimizedImage;