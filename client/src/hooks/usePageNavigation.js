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
      }, 100); // Small delay to ensure page is loaded
    }, 800); // Match the circular expand duration
  };

  return { navigateWithTransition };
};