import React from 'react';
import { useTenant } from '../context/TenantContext';

const Students = () => {
  const { tenant, students } = useTenant();
  if (!tenant || !students || students.length === 0) return null;

  return (
    <section id="students" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: tenant.accentColor }}>
            OUR COMMUNITY
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Students</h2>
          <div className="w-20 h-1 mx-auto rounded-full" style={{ backgroundColor: tenant.accentColor }}></div>
          <p className="mt-4 text-lg text-gray-500">Meet our talented students</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {students.map(student => (
            <div key={student.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
              {/* Photo */}
              <div className="pt-8 px-6 pb-4 flex flex-col items-center">
                {student.imageUrl ? (
                  <img src={student.imageUrl} alt={student.name}
                    className="w-28 h-28 rounded-full object-cover border-4 shadow-md"
                    style={{ borderColor: tenant.primaryColor + '40' }} />
                ) : (
                  <div className="w-28 h-28 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md"
                    style={{ backgroundColor: tenant.primaryColor }}>
                    {student.name.charAt(0)}
                  </div>
                )}

                {/* Name */}
                <h3 className="font-bold text-gray-900 text-base mt-4 text-center">{student.name}</h3>

                {/* Grade */}
                {student.grade && (
                  <p className="text-sm text-gray-400 mt-1">{student.grade}</p>
                )}

                {/* Achievement */}
                {student.achievement && (
                  <span className="mt-3 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: tenant.accentColor + '20', color: tenant.accentColor }}>
                    🏆 {student.achievement}
                  </span>
                )}
              </div>

              {/* Description */}
              {student.about && (
                <div className="px-5 pb-6 border-t border-gray-50 pt-3">
                  <p className="text-sm text-gray-500 leading-relaxed text-center">{student.about}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Students;
