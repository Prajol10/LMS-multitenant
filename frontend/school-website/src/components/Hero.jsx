import React from 'react';
import { useTenant } from '../context/TenantContext';

const Hero = () => {
  const { tenant } = useTenant();

  if (!tenant) return null;

  return (
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                className="px-8 py-3 bg-white text-blue-900 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg"
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

          {/* Image placeholder */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white border-opacity-20">
                {tenant.logoUrl ? (
                  <img 
                    src={tenant.logoUrl} 
                    alt={`${tenant.schoolName} Logo`} 
                    className="w-40 h-40 md:w-48 md:h-48 object-contain"
                  />
                ) : (
                  <div className="text-6xl font-bold text-white">
                    {tenant.schoolName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-12 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.19,206.8-37.5C438.64,32.43,512.76,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".25" 
            className="fill-current"
          ></path>
          <path 
            d="M0,0V15.81C13,36.92,27.6,66.51,27.6,66.51V0Z" 
            opacity=".5" 
            className="fill-current"
          ></path>
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.19,206.8-37.5C438.64,32.43,512.76,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            className="fill-current"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
