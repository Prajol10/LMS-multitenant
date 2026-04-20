import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';

const SCHOOL_PHOTOS = [
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
  'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800',
  'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800',
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
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
      <section
        id="hero"
        className="pt-16 min-h-screen flex items-center relative overflow-hidden"
        style={{ backgroundColor: tenant.primaryColor }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text content */}
            <div className="text-center lg:text-left text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {tenant.schoolName}
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Excellence in Education Since {tenant.establishedYear}
              </p>
              <p className="text-lg mb-10 max-w-2xl mx-auto lg:mx-0 opacity-85">
                Providing quality education and nurturing future leaders in a supportive learning environment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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
            </div>

            {/* Animated photo slideshow */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                {photos.map((photo, idx) => (
                  <div
                    key={idx}
                    className="absolute inset-0 rounded-2xl overflow-hidden transition-opacity duration-1000"
                    style={{ opacity: idx === currentPhoto ? 1 : 0 }}
                  >
                    <img
                      src={photo}
                      alt={`School photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 border-4 border-white border-opacity-30 rounded-2xl"></div>
                  </div>
                ))}
                {/* Photo dots */}
                <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2">
                  {photos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPhoto(idx)}
                      className="w-2 h-2 rounded-full transition-all duration-300 bg-white"
                      style={{ opacity: idx === currentPhoto ? 1 : 0.4 }}
                    />
                  ))}
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20 animate-pulse"
                  style={{ backgroundColor: tenant.accentColor }}></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-20 animate-pulse"
                  style={{ backgroundColor: tenant.accentColor }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
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
            <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
              <div className="aspect-w-16 aspect-h-9" style={{ paddingTop: '56.25%', position: 'relative' }}>
                <iframe
                  src={tenant.videoUrl.replace('watch?v=', 'embed/')}
                  title="School Video"
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Hero;
