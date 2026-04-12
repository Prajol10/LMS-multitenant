import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5071/api';

const SCHOOLS_FALLBACK = [
  { name: 'Rato Bangala School', subdomain: 'ratobangala', color: '#8B0000', est: 1990 },
  { name: 'St. Xaviers College', subdomain: 'xavier', color: '#003087', est: 1951 },
  { name: 'Budhanilkantha School', subdomain: 'budhanilkantha', color: '#1B4332', est: 1972 },
  { name: 'Lalitpur Engineering College', subdomain: 'lec', color: '#1B2A4A', est: 2001 },
  { name: 'Shuvatara School', subdomain: 'shuvatara', color: '#2C3E50', est: 1994 },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [schools, setSchools] = useState(SCHOOLS_FALLBACK);
  const [loadingSchools, setLoadingSchools] = useState(true);

  useEffect(() => {
    fetch(`${API}/superadmin/schools`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSchools(data.filter(s => s.isActive).map(s => ({
            name: s.schoolName,
            subdomain: s.subdomain,
            color: s.primaryColor,
            est: s.establishedYear,
            logoUrl: s.logoUrl
          })));
        }
      })
      .catch(() => {})
      .finally(() => setLoadingSchools(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-[#1B2A4A] text-white px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#C9A84C] rounded-lg flex items-center justify-center font-bold text-[#1B2A4A]">I</div>
          <span className="text-xl font-bold">Dailo Technology</span>
        </div>
        <button
          onClick={() => navigate('/superadmin/login')}
          className="bg-[#C9A84C] text-[#1B2A4A] px-4 py-2 rounded-lg font-medium hover:bg-yellow-400 transition text-sm">
          Admin Login
        </button>
      </nav>

      {/* Hero */}
      <div className="bg-[#1B2A4A] text-white py-20 px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">School Website Platform</h1>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto">
          Powering digital presence for Nepal's leading schools and colleges
        </p>
      </div>

      {/* Schools Grid */}
      <div className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="text-2xl font-bold text-[#1B2A4A] mb-8 text-center">Our Partner Schools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map(school => (
            <div key={school.subdomain} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition">
              <div className="h-3" style={{ backgroundColor: school.color }}></div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: school.color }}>
                    {school.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{school.name}</h3>
                    <p className="text-sm text-gray-500">Est. {school.est}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <a href={`/${school.subdomain}`}
                    className="flex-1 text-center py-2 rounded-lg text-sm font-medium text-white transition"
                    style={{ backgroundColor: school.color }}>
                    View Website
                  </a>
                  <a href={`/${school.subdomain}/admin`}
                    className="flex-1 text-center py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
                    Admin
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1B2A4A] text-white text-center py-6 text-sm">
        <p>© 2026 Dailo Technology. All rights reserved.</p>
      </footer>
    </div>
  );
}
