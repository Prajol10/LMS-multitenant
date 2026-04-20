import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';

const Navbar = () => {
  const { tenant } = useTenant();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  if (!tenant) return null;

  return (
    <nav 
      className="fixed w-full z-50 transition-all duration-300"
      style={{ backgroundColor: tenant.primaryColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and School Name */}
          <div className="flex items-center space-x-3">
            {tenant.logoUrl ? (
              <img 
                src={tenant.logoUrl} 
                alt={`${tenant.schoolName} Logo`} 
                className="h-10 w-10 rounded-full object-cover flex-shrink-0 border-2 border-white border-opacity-30"
              />
            ) : (
              <div className="bg-white h-10 w-10 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold" style={{ color: tenant.primaryColor }}>
                  {tenant.schoolName.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-white font-bold text-lg hidden md:block">
              {tenant.schoolName}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <button 
              onClick={() => scrollToSection('hero')}
              className="text-white hover:text-yellow-300 transition"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-white hover:text-yellow-300 transition"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('notices')}
              className="text-white hover:text-yellow-300 transition"
            >
              Notices
            </button>
            <button 
              onClick={() => scrollToSection('gallery')}
              className="text-white hover:text-yellow-300 transition"
            >
              Gallery
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-white hover:text-yellow-300 transition"
            >
              Contact
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white rounded-b-lg shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button 
                onClick={() => scrollToSection('hero')}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 w-full text-left"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 w-full text-left"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('notices')}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 w-full text-left"
              >
                Notices
              </button>
              <button 
                onClick={() => scrollToSection('gallery')}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 w-full text-left"
              >
                Gallery
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 w-full text-left"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
