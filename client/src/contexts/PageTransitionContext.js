import React, { createContext, useContext, useState } from 'react';

const PageTransitionContext = createContext();

export const usePageTransition = () => {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error('usePageTransition must be used within a PageTransitionProvider');
  }
  return context;
};

export const PageTransitionProvider = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState('up'); // 'up', 'down', 'left', 'right'

  const startTransition = (direction = 'up') => {
    setTransitionDirection(direction);
    setIsTransitioning(true);
  };

  const endTransition = () => {
    setIsTransitioning(false);
  };

  return (
    <PageTransitionContext.Provider
      value={{
        isTransitioning,
        transitionDirection,
        startTransition,
        endTransition,
      }}
    >
      {children}
    </PageTransitionContext.Provider>
  );
};