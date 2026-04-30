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
  const [programs, setPrograms] = useState([]);
  const [students, setStudents] = useState([]);
  const [leadership, setLeadership] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTenantData = async () => {
    try {
      setLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const identifier = schoolSlug || urlParams.get('school');
      if (!identifier) throw new Error('No school identifier found');

      const tenantData = await ApiService.getSchoolByTenant(identifier);
      setTenant(tenantData);

      const [noticesData, galleryData, programsData, studentsData] = await Promise.all([
        ApiService.getNoticesByTenant(identifier),
        ApiService.getGalleryByTenant(identifier),
        ApiService.getProgramsByTenant(identifier).catch(() => []),
        ApiService.getStudentsByTenant(identifier).catch(() => []),
      ]);

      setNotices(noticesData);
      setGallery(galleryData);
      setPrograms(programsData);
      setStudents(studentsData);
    } catch (err) {
      setError(err.message || 'Failed to load school data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTenantData(); }, [schoolSlug]);

  return (
    <TenantContext.Provider value={{ tenant, notices, gallery, programs, students, leadership, loading, error, reloadTenantData: loadTenantData }}>
      {children}
    </TenantContext.Provider>
  );
};
