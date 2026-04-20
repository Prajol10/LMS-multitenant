import React, { useState, useEffect, useRef } from 'react';
import { useTenant } from '../context/TenantContext';

const Gallery = () => {
  const { tenant, gallery } = useTenant();
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    if (gallery.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % gallery.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [gallery.length]);

  useEffect(() => {
    if (carouselRef.current && gallery.length > 0) {
      const itemWidth = carouselRef.current.offsetWidth / 3;
      carouselRef.current.scrollTo({
        left: currentIndex * itemWidth,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  if (!tenant) return null;

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">School Gallery</h2>
          <div className="w-20 h-1 mx-auto" style={{ backgroundColor: tenant.accentColor }}></div>
          <p className="mt-4 text-xl text-gray-600">A glimpse into our school life</p>
        </div>

        {gallery.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 p-8 rounded-lg max-w-md mx-auto">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-900">No Images Available</h3>
              <p className="mt-2 text-gray-500">There are currently no gallery images to display.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Auto-scrolling carousel */}
            <div className="relative overflow-hidden rounded-2xl mb-4">
              <div
                ref={carouselRef}
                className="flex overflow-x-hidden gap-4"
                style={{ scrollBehavior: 'smooth' }}
              >
                {[...gallery, ...gallery, ...gallery].map((image, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 w-1/3 cursor-pointer group relative overflow-hidden rounded-xl"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image.imageUrl}
                      alt={image.caption || 'Gallery image'}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {image.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 text-white p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-sm">{image.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-4">
              {gallery.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: idx === currentIndex ? tenant.primaryColor : '#D1D5DB',
                    width: idx === currentIndex ? '24px' : '8px'
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.caption || 'Enlarged image'}
                className="max-h-[80vh] max-w-full object-contain rounded-xl"
              />
              {selectedImage.caption && (
                <div className="text-center text-white mt-4">
                  <p className="text-lg">{selectedImage.caption}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
