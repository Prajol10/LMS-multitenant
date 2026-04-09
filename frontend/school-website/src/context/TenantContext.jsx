import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';

const TenantContext = createContext();

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export const TenantProvider = ({ children }) => {
  const [tenant, setTenant] = useState(null);
  const [notices, setNotices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract subdomain from hostname
  const getSubdomain = () => {
    const hostname = window.location.hostname;
    
    // For localhost testing
    if (hostname === 'localhost') {
      return 'ratobangala'; // Default to ratobangala for local development
    }
    
    // For production domains like subdomain.edunepal.com
    if (hostname.endsWith('.edunepal.com')) {
      return hostname.replace('.edunepal.com', '');
    }
    
    return null;
  };

  // Load tenant data
  const loadTenantData = async () => {
    try {
      setLoading(true);
      const subdomain = getSubdomain();
      
      if (!subdomain) {
        throw new Error('No subdomain found');
      }

      // Fetch tenant data
      const tenantData = await ApiService.getSchoolBySubdomain(subdomain);
      setTenant(tenantData);

      // Fetch notices
      const noticesData = await ApiService.getNoticesBySubdomain(subdomain);
      setNotices(noticesData);

      // Fetch gallery
      const galleryData = await ApiService.getGalleryBySubdomain(subdomain);
      setGallery(galleryData);
    } catch (err) {
      console.error('Error loading tenant data:', err);
      setError(err.message || 'Failed to load school data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTenantData();
  }, []);

  const value = {
    tenant,
    notices,
    gallery,
    loading,
    error,
    reloadTenantData: loadTenantData
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};
