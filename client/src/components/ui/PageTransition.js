import React, { useEffect, useState } from 'react';
import { usePageTransition } from '../../contexts/PageTransitionContext';

const PageTransition = () => {
    const { isTransitioning, direction } = usePageTransition();
    const [animationPhase, setAnimationPhase] = useState('idle');

    useEffect(() => {
        if (isTransitioning) {
            setAnimationPhase('entering');
            
            const coverTimeout = setTimeout(() => {
                setAnimationPhase('exiting');
            }, 1200); // Reduced for snappier feel
            
            return () => clearTimeout(coverTimeout);
        } else {
            const resetTimeout = setTimeout(() => {
                setAnimationPhase('idle');
            }, 100);
            
            return () => clearTimeout(resetTimeout);
        }
    }, [isTransitioning]);

    if (animationPhase === 'idle') return null;

    // Using clip-path for buttery smooth performance
    const getTransitionStyles = () => {
        const baseStyles = {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#45372B',
            zIndex: 9999,
            pointerEvents: animationPhase === 'exiting' ? 'none' : 'all',
            willChange: 'clip-path, transform',
            transform: 'translateZ(0)', // Force GPU acceleration
            backfaceVisibility: 'hidden',
            perspective: '1000px',
        };

        // Determine animation based on direction
        const isReverse = direction === 'up' || direction === 'back';
        
        if (animationPhase === 'entering') {
            return {
                ...baseStyles,
                animation: isReverse 
                    ? 'liquidRevealReverseEnter 1.2s cubic-bezier(0.65, 0, 0.35, 1) forwards'
                    : 'liquidRevealEnter 1.2s cubic-bezier(0.65, 0, 0.35, 1) forwards',
            };
        } else if (animationPhase === 'exiting') {
            return {
                ...baseStyles,
                animation: isReverse
                    ? 'liquidRevealReverseExit 0.8s cubic-bezier(0.65, 0, 0.35, 1) forwards'
                    : 'liquidRevealExit 0.8s cubic-bezier(0.65, 0, 0.35, 1) forwards',
            };
        }
        
        return baseStyles;
    };

    return <div style={getTransitionStyles()} />;
};

export default PageTransition;