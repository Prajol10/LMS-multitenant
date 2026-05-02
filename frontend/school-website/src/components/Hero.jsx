import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';

const SCHOOL_PHOTOS = [
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200',
  'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=1200',
  'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1200',
];

const Hero = () => {
  const { tenant } = useTenant();
  const [currentPhoto, setCurrentPhoto] = useState(0);

  const parseBanners = (bannerUrl) => {
    if (!bannerUrl) return null;
    try {
      const parsed = JSON.parse(bannerUrl);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
    return [bannerUrl];
  };

  const photos = parseBanners(tenant?.bannerUrl) || SCHOOL_PHOTOS;

  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentPhoto(prev => (prev + 1) % photos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [photos.length]);

  if (!tenant) return null;

  return (
    <section id="hero" className="pt-16 min-h-screen flex items-center relative overflow-hidden">
      {photos.map((photo, idx) => (
        <div key={idx} className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: idx === currentPhoto ? 1 : 0 }}>
          <img src={photo} alt={`School photo ${idx + 1}`} className="w-full h-full object-cover" style={{ filter: 'blur(2px)', transform: 'scale(1.03)' }} />
        </div>
      ))}

      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.65))' }} />

      {photos.length > 1 && (
        <>
          <button onClick={() => setCurrentPhoto(prev => (prev - 1 + photos.length) % photos.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 transition-all duration-200 hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: '50%', padding: '12px', color: 'white' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={() => setCurrentPhoto(prev => (prev + 1) % photos.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 transition-all duration-200 hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: '50%', padding: '12px', color: 'white' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        <div className="text-white max-w-4xl mx-auto">
          {tenant.logoUrl && (
            <div className="flex justify-center mb-6">
              <img src={tenant.logoUrl} alt={tenant.schoolName}
                className="w-20 h-20 rounded-full object-cover border-4 border-white border-opacity-50 shadow-xl" />
            </div>
          )}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight drop-shadow-lg tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
            <span className="text-white block">{tenant.schoolName.split(' ').slice(0, Math.ceil(tenant.schoolName.split(' ').length / 2)).join(' ')}</span>
            <span className="block" style={{ color: tenant.accentColor }}>{tenant.schoolName.split(' ').slice(Math.ceil(tenant.schoolName.split(' ').length / 2)).join(' ')}</span>
          </h1>
          <p className="text-xl md:text-2xl mb-6 opacity-90 drop-shadow font-light tracking-widest uppercase">
            Excellence in Education Since {tenant.establishedYear}
          </p>
          <p className="text-lg mb-10 max-w-2xl mx-auto opacity-85 drop-shadow">
            Providing quality education and nurturing future leaders in a supportive learning environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 font-bold rounded-lg transition shadow-lg text-white uppercase tracking-wide"
              style={{ backgroundColor: tenant.accentColor }}>
              Learn More
            </button>
            <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border-2 text-white font-bold rounded-lg hover:bg-white hover:bg-opacity-10 transition uppercase tracking-wide"
              style={{ borderColor: tenant.accentColor, color: tenant.accentColor }}>
              Contact Us
            </button>
          </div>
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto">
            <div className="text-center">
              <p className="text-3xl font-bold">{tenant.establishedYear || 'N/A'}</p>
              <p className="text-sm opacity-75">Established</p>
            </div>
            <div className="text-center border-x border-white border-opacity-30">
              <p className="text-3xl font-bold">{tenant.totalStudents ? tenant.totalStudents + '+' : '500+'}</p>
              <p className="text-sm opacity-75">Students</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{tenant.totalPrograms ? tenant.totalPrograms + '+' : '25+'}</p>
              <p className="text-sm opacity-75">Programs</p>
            </div>
          </div>
        </div>
      </div>

      {photos.length > 1 && (
        <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2 z-20">
          {photos.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentPhoto(idx)}
              className="h-2 rounded-full transition-all duration-300 bg-white"
              style={{ opacity: idx === currentPhoto ? 1 : 0.4, width: idx === currentPhoto ? '24px' : '8px' }} />
          ))}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg className="w-full h-12 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.19,206.8-37.5C438.64,32.43,512.76,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-current"></path>
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.19,206.8-37.5C438.64,32.43,512.76,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" className="fill-current"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
