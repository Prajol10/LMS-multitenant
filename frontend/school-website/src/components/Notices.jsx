import React from 'react';
import { useTenant } from '../context/TenantContext';

const Notices = () => {
  const { tenant, notices } = useTenant();

  if (!tenant) return null;

  // Format date helper
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <section id="notices" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latest Notices
          </h2>
          <div className="w-20 h-1 bg-yellow-500 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">
            Stay updated with our latest announcements
          </p>
        </div>

        {notices.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white p-8 rounded-lg shadow-card max-w-md mx-auto">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-900">No Notices Available</h3>
              <p className="mt-2 text-gray-500">
                There are currently no notices to display.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {notices.map((notice) => (
              <div 
                key={notice.id}
                className={`rounded-xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover ${
                  notice.isImportant 
                    ? 'border-l-4 border-red-500 bg-red-50' 
                    : 'bg-white'
                }`}
              >
                <div className="p-6">
                  {notice.isImportant && (
                    <div className="inline-block px-3 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full mb-3">
                      IMPORTANT
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {notice.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {notice.content}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{formatDate(notice.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Notices;
