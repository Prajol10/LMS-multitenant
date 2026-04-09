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

  // Extract tenant identifier from URL query parameter or subdomain
  const getTenantIdentifier = () => {
    // First check query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const schoolParam = urlParams.get('school');
    if (schoolParam) {
      return schoolParam;
    }

    // For localhost testing
    const hostname = window.location.hostname;
    if (hostname === 'localhost') {
      return 'ratobangala'; // Default to ratobangala for local development
    }

    // For production domains like subdomain.netlify.app
    if (hostname.endsWith('.netlify.app')) {
      const parts = hostname.split('.');
      if (parts.length >= 3) {
        return parts[0]; // subdomain part
      }
    }

    return null;
  };

  // Load tenant data
  const loadTenantData = async () => {
    try {
      setLoading(true);
      const tenantIdentifier = getTenantIdentifier();
      
      if (!tenantIdentifier) {
        throw new Error('No school identifier found in URL');
      }

      // Fetch tenant data
      const tenantData = await ApiService.getSchoolByTenant(tenantIdentifier);
      setTenant(tenantData);

      // Fetch notices
      const noticesData = await ApiService.getNoticesByTenant(tenantIdentifier);
      setNotices(noticesData);

      // Fetch gallery
      const galleryData = await ApiService.getGalleryByTenant(tenantIdentifier);
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
