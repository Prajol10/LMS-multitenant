import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';

const TenantContext = createContext();

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) throw new Error('useTenant must be used within a TenantProvider');
  return context;
};

export const TenantProvider = ({ children, schoolSlug }) => {
  const [tenant, setTenant] = useState(null);
  const [notices, setNotices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTenantData = async () => {
    try {
      setLoading(true);

      // Use passed schoolSlug, or fall back to ?school= query param
      const urlParams = new URLSearchParams(window.location.search);
      const identifier = schoolSlug || urlParams.get('school');

      if (!identifier) {
        throw new Error('No school identifier found');
      }

      const tenantData = await ApiService.getSchoolByTenant(identifier);
      setTenant(tenantData);

      const noticesData = await ApiService.getNoticesByTenant(identifier);
      setNotices(noticesData);

      const galleryData = await ApiService.getGalleryByTenant(identifier);
      setGallery(galleryData);
    } catch (err) {
      setError(err.message || 'Failed to load school data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTenantData(); }, [schoolSlug]);

  return (
    <TenantContext.Provider value={{ tenant, notices, gallery, loading, error, reloadTenantData: loadTenantData }}>
      {children}
    </TenantContext.Provider>
  );
};
