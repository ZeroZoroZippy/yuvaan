import { useLocation } from 'react-router-dom';
import { getMetaConfig } from '../config/metaConfigs';

/**
 * Custom hook to get meta configuration for the current route
 * @param {Object} data - Optional data for dynamic routes (for example project detail data)
 * @returns {Object} Meta configuration object
 */
export const useMeta = (data = null) => {
  const location = useLocation();
  const route = location.pathname;
  
  return getMetaConfig(route, data);
};

export default useMeta;
