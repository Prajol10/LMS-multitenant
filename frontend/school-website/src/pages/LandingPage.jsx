import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5071/api';

export default function LandingPage() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/superadmin/schools`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(r => r.json())
      .then(data => { setSchools(Array.isArray(data) ? data : []); })
      .catch(() => setSchools([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="bg-[#1B2A4A] text-white px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#C9A84C] rounded-lg flex items-center justify-center font-bold text-[#1B2A4A]">I</div>
          <span className="text-xl font-bold">ItexGiti</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#schools" className="text-sm text-blue-200 hover:text-white transition">Schools</a>
          <a href="#features" className="text-sm text-blue-200 hover:text-white transition">Features</a>
          <button onClick={() => navigate('/admin/login')}
            className="bg-[#C9A84C] text-[#1B2A4A] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#b8943f] transition">
            Admin Login
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-[#1B2A4A] text-white py-24 px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="bg-[#C9A84C] text-[#1B2A4A] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            Multi-Tenant School Platform
          </span>
          <h1 className="text-5xl font-bold mt-6 mb-4 leading-tight">
            One Platform.<br />Every School.
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto mb-8">
            ItexGiti provides each school with their own beautiful website — 
            custom colors, custom content, one powerful system.
          </p>
          <div className="flex justify-center gap-4">
            <a href="#schools"
              className="bg-[#C9A84C] text-[#1B2A4A] px-6 py-3 rounded-lg font-bold hover:bg-[#b8943f] transition">
              View Schools
            </a>
            <button onClick={() => navigate('/admin/login')}
              className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-[#1B2A4A] transition">
              Admin Panel
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-[#C9A84C] py-10 px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-[#1B2A4A]">{schools.length}+</p>
            <p className="text-[#1B2A4A] font-medium mt-1">Schools Live</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#1B2A4A]">100%</p>
            <p className="text-[#1B2A4A] font-medium mt-1">Customizable</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#1B2A4A]">Free</p>
            <p className="text-[#1B2A4A] font-medium mt-1">For Schools</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="py-20 px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1B2A4A] text-center mb-12">Everything a School Needs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🎨', title: 'Custom Branding', desc: 'Each school gets their own colors, logo, and unique website identity.' },
              { icon: '📢', title: 'Notice Board', desc: 'Post important notices and announcements instantly. Mark urgent ones.' },
              { icon: '🖼️', title: 'Photo Gallery', desc: 'Showcase school events, facilities, and student activities.' },
              { icon: '📱', title: 'Mobile Responsive', desc: 'Looks perfect on every device — phone, tablet, and desktop.' },
              { icon: '🔒', title: 'Secure Admin Panel', desc: 'Each school has their own private admin login to manage content.' },
              { icon: '⚡', title: 'Instant Updates', desc: 'Changes go live immediately. No waiting, no technical knowledge needed.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <span className="text-3xl">{icon}</span>
                <h3 className="text-lg font-bold text-[#1B2A4A] mt-3 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Schools List */}
      <div id="schools" className="py-20 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1B2A4A] text-center mb-4">Schools On Our Platform</h2>
          <p className="text-gray-500 text-center mb-12">Click any school to visit their live website</p>

          {loading ? (
            <div className="text-center text-gray-400">Loading schools...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schools.filter(s => s.isActive).map(school => (
                <a
                  key={school.id}
                  href={`https://lmsschool.netlify.app?school=${school.subdomain}`}
                  target="_blank"
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden border border-gray-100 group"
                >
                  <div className="h-3" style={{ backgroundColor: school.primaryColor }} />
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: school.primaryColor }}>
                        {school.schoolName[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 group-hover:text-[#1B2A4A] transition">{school.schoolName}</h3>
                        <p className="text-xs text-gray-400">{school.subdomain}.lmsschool.netlify.app</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">{school.aboutText || 'A premier educational institution.'}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-400">📍 {school.address?.split(',')[0] || 'Nepal'}</span>
                      <span className="text-xs font-medium text-[#1B2A4A] group-hover:text-[#C9A84C] transition">Visit →</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#1B2A4A] text-white py-16 px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Want a Website for Your School?</h2>
        <p className="text-blue-200 mb-8">Contact ItexGiti to get your school's website set up for free.</p>
        <a href="mailto:itexgiti@gmail.com"
          className="bg-[#C9A84C] text-[#1B2A4A] px-8 py-3 rounded-lg font-bold hover:bg-[#b8943f] transition inline-block">
          Contact Us — itexgiti@gmail.com
        </a>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-gray-400 py-6 px-8 text-center text-sm">
        <p>© 2026 ItexGiti. Built with ❤️ for Nepali schools.</p>
      </div>
    </div>
  );
}
