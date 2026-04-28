import React from 'react';
import { useTenant } from '../context/TenantContext';

const Students = () => {
  const { tenant, students } = useTenant();
  if (!tenant || !students || students.length === 0) return null;

  return (
    <section id="students" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Students</h2>
          <div className="w-20 h-1 mx-auto" style={{ backgroundColor: tenant.accentColor }}></div>
          <p className="mt-4 text-xl text-gray-600">Meet our talented students</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {students.map(student => (
            <div key={student.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 text-center p-6">
              {student.imageUrl ? (
                <img src={student.imageUrl} alt={student.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4" style={{ borderColor: tenant.primaryColor + '40' }} />
              ) : (
                <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: tenant.primaryColor }}>
                  {student.name.charAt(0)}
                </div>
              )}
              <h3 className="font-bold text-gray-900 text-sm">{student.name}</h3>
              {student.grade && (
                <p className="text-xs text-gray-500 mt-1">{student.grade}</p>
              )}
              {student.achievement && (
                <p className="text-xs mt-2 px-2 py-1 rounded-full font-medium" style={{ backgroundColor: tenant.accentColor + '20', color: tenant.accentColor }}>
                  🏆 {student.achievement}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Students;
