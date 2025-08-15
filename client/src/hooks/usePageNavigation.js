import { useNavigate } from 'react-router-dom';
import { usePageTransition } from '../contexts/PageTransitionContext';

export const usePageNavigation = () => {
  const navigate = useNavigate();
  const { startTransition, endTransition } = usePageTransition();

  const navigateWithTransition = (path, direction = 'up') => {
    // Start the transition
    startTransition(direction);

    // Navigate after the overlay covers the screen
    setTimeout(() => {
      navigate(path);
      
      // End transition after navigation is complete
      setTimeout(() => {
        endTransition();
      }, 50); // Reduced delay to prevent animation conflicts
    }, 600); // Reduced timing to prevent glitches
  };

  return { navigateWithTransition };
};