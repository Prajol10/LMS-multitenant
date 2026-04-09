import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';

const Gallery = () => {
  const { tenant, gallery } = useTenant();
  const [selectedImage, setSelectedImage] = useState(null);

  if (!tenant) return null;

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            School Gallery
          </h2>
          <div className="w-20 h-1 bg-yellow-500 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">
            A glimpse into our school life
          </p>
        </div>

        {gallery.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 p-8 rounded-lg shadow-card max-w-md mx-auto">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-900">No Images Available</h3>
              <p className="mt-2 text-gray-500">
                There are currently no gallery images to display.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((image) => (
              <div 
                key={image.id}
                className="group relative overflow-hidden rounded-xl shadow-card cursor-pointer"
                onClick={() => openLightbox(image)}
              >
                <div className="aspect-w-4 aspect-h-3">
                  <img
                    src={image.imageUrl}
                    alt={image.caption || 'Gallery image'}
                    className="object-cover w-full h-64 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {image.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 text-white p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-sm">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.caption || 'Enlarged image'}
                className="max-h-[80vh] max-w-full object-contain"
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
