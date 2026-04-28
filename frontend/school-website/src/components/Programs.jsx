import React from 'react';
import { useTenant } from '../context/TenantContext';

const Programs = () => {
  const { tenant, programs } = useTenant();
  if (!tenant || !programs || programs.length === 0) return null;

  return (
    <section id="programs" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Programs</h2>
          <div className="w-20 h-1 mx-auto" style={{ backgroundColor: tenant.accentColor }}></div>
          <p className="mt-4 text-xl text-gray-600">Explore our academic offerings</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map(program => (
            <div key={program.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              {program.imageUrl ? (
                <img src={program.imageUrl} alt={program.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 flex items-center justify-center" style={{ backgroundColor: tenant.primaryColor + '15' }}>
                  <svg className="w-16 h-16 opacity-30" style={{ color: tenant.primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{program.title}</h3>
                <div className="flex gap-2 mb-3 flex-wrap">
                  {program.level && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: tenant.primaryColor }}>
                      {program.level}
                    </span>
                  )}
                  {program.duration && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      ⏱ {program.duration}
                    </span>
                  )}
                </div>
                {program.description && (
                  <p className="text-gray-600 text-sm leading-relaxed">{program.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;
