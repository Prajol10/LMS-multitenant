import React from 'react';
import { marked } from 'marked';
import { useTenant } from '../context/TenantContext';

const About = () => {
  const { tenant } = useTenant();

  if (!tenant) return null;

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About Our School
          </h2>
          <div className="w-20 h-1 bg-yellow-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Welcome to {tenant.schoolName}
            </h3>
            <div 
              className="prose prose-lg text-gray-700 mb-8"
              dangerouslySetInnerHTML={{ __html: marked(tenant.aboutText || 'No description available.') }}
            />
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-10">
              <div className="text-center p-6 bg-blue-50 rounded-lg shadow-card">
                <div className="text-3xl font-bold text-blue-800">{tenant.establishedYear || 'N/A'}</div>
                <div className="text-gray-600">Established</div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg shadow-card">
                <div className="text-3xl font-bold text-green-800">500+</div>
                <div className="text-gray-600">Students</div>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg shadow-card">
                <div className="text-3xl font-bold text-purple-800">25+</div>
                <div className="text-gray-600">Programs</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96 flex items-center justify-center">
              <span className="text-gray-500">School Image</span>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-400 rounded-lg opacity-20"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-400 rounded-lg opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
