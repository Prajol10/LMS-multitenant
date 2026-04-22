import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';

const SCHOOL_PHOTOS = [
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200',
  'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=1200',
  'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1200',
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200',
];

const Hero = () => {
  const { tenant, gallery } = useTenant();
  const [currentPhoto, setCurrentPhoto] = useState(0);

  const photos = gallery && gallery.length > 0
    ? gallery.map(g => g.imageUrl)
    : SCHOOL_PHOTOS;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhoto(prev => (prev + 1) % photos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [photos.length]);

  if (!tenant) return null;

  return (
    <>
      <section id="hero" className="pt-16 min-h-screen flex items-center relative overflow-hidden">

        {/* Background slideshow images */}
        {photos.map((photo, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: idx === currentPhoto ? 1 : 0 }}
          >
            <img
              src={photo}
              alt={`School photo ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Dark overlay with school color tint */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${tenant.primaryColor}99 0%, ${tenant.primaryColor}66 50%, rgba(0,0,0,0.4) 100%)`
          }}
        />

        {/* Left and right arrows */}
        <button
          onClick={() => setCurrentPhoto(prev => (prev - 1 + photos.length) % photos.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-40 text-white rounded-full p-3 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setCurrentPhoto(prev => (prev + 1) % photos.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-40 text-white rounded-full p-3 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          <div className="text-white max-w-4xl mx-auto">
            {/* School logo */}
            {tenant.logoUrl && (
              <div className="flex justify-center mb-6">
                <img
                  src={tenant.logoUrl}
                  alt={tenant.schoolName}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white border-opacity-50 shadow-xl"
                />
              </div>
            )}

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight drop-shadow-lg">
              {tenant.schoolName}
            </h1>
            <p className="text-xl md:text-2xl mb-6 opacity-90 drop-shadow">
              Excellence in Education Since {tenant.establishedYear}
            </p>
            <p className="text-lg mb-10 max-w-2xl mx-auto opacity-85 drop-shadow">
              Providing quality education and nurturing future leaders in a supportive learning environment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 bg-white font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg"
                style={{ color: tenant.primaryColor }}
              >
                Learn More
              </button>
              <button
                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:bg-opacity-10 transition"
              >
                Contact Us
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto">
              <div className="text-center">
                <p className="text-3xl font-bold">{tenant.establishedYear}</p>
                <p className="text-sm opacity-75">Established</p>
              </div>
              <div className="text-center border-x border-white border-opacity-30">
                <p className="text-3xl font-bold">{tenant.totalStudents ? tenant.totalStudents + "+" : "500+"}</p>
                <p className="text-sm opacity-75">Students</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">25+</p>
                <p className="text-sm opacity-75">Programs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dots indicator */}
        <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2 z-20">
          {photos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPhoto(idx)}
              className="h-2 rounded-full transition-all duration-300 bg-white"
              style={{
                opacity: idx === currentPhoto ? 1 : 0.4,
                width: idx === currentPhoto ? '24px' : '8px'
              }}
            />
          ))}
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg className="w-full h-12 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.19,206.8-37.5C438.64,32.43,512.76,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-current"></path>
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.19,206.8-37.5C438.64,32.43,512.76,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" className="fill-current"></path>
          </svg>
        </div>
      </section>

      {/* Video Section */}
      {tenant.videoUrl && (
        <section id="video" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">School Video</h2>
              <div className="w-20 h-1 mx-auto" style={{ backgroundColor: tenant.accentColor }}></div>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-4xl mx-auto"
              style={{ paddingTop: '56.25%', position: 'relative' }}>
              <iframe
                src={tenant.videoUrl.replace('watch?v=', 'embed/')}
                title="School Video"
                className="absolute inset-0 w-full h-full"
                style={{ border: 0, top: 0, left: 0, position: 'absolute' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Hero;
