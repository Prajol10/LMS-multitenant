import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5071/api';

const ImageUpload = ({ label, value, onChange, hint }) => {
  const [mode, setMode] = useState('url');
  return (
    <div className="col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex gap-2 mb-2">
        {['url', 'file'].map(m => (
          <button key={m} type="button" onClick={() => setMode(m)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${mode === m ? 'bg-[#1B2A4A] text-white' : 'bg-gray-100 text-gray-700'}`}>
            {m === 'url' ? 'Paste URL' : 'Upload from Device'}
          </button>
        ))}
      </div>
      {mode === 'url' ? (
        <input value={value || ''} onChange={e => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
          placeholder="https://..." />
      ) : (
        <div>
          <input type="file" accept="image/*" onChange={e => {
            const file = e.target.files[0]; if (!file) return;
            const reader = new FileReader();
            reader.onloadend = () => onChange(reader.result);
            reader.readAsDataURL(file);
          }} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          {value && (
            <img src={value} alt="Preview" className="mt-2 h-24 object-contain rounded-lg border border-gray-200 p-1 bg-gray-50" />
          )}
        </div>
      )}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
};

export default function SuperAdminDashboard() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
  const [form, setForm] = useState({
    schoolName: '', subdomain: '', primaryColor: '#1B2A4A',
    accentColor: '#C9A84C', aboutText: '', address: '',
    phone: '', email: '', establishedYear: '',
    totalStudents: '', totalTeachers: '', totalPrograms: '',
    logoUrl: '', bannerUrl: '',
    facebookUrl: '', instagramUrl: '', websiteUrl: '',
    mapEmbedUrl: '', videoUrl: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [adminForms, setAdminForms] = useState({});
  const [adminMessages, setAdminMessages] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => { fetchSchools(); }, []);

  const fetchSchools = async () => {
    try {
      const res = await fetch(`${API}/superadmin/schools`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSchools(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setForm({
      schoolName: '', subdomain: '', primaryColor: '#1B2A4A',
      accentColor: '#C9A84C', aboutText: '', address: '',
      phone: '', email: '', establishedYear: '',
      totalStudents: '', totalTeachers: '', totalPrograms: '',
      logoUrl: '', bannerUrl: '',
      facebookUrl: '', instagramUrl: '', websiteUrl: '',
      mapEmbedUrl: '', videoUrl: ''
    });
    setEditingSchool(null);
    setShowForm(false);
  };

  const handleSubmitSchool = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      const isEditing = !!editingSchool;
      const url = isEditing ? `${API}/superadmin/schools/${editingSchool.id}` : `${API}/school`;
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          schoolName: form.schoolName,
          subdomain: form.subdomain,
          primaryColor: form.primaryColor,
          accentColor: form.accentColor,
          aboutText: form.aboutText || '',
          address: form.address || '',
          phone: form.phone || '',
          email: form.email || '',
          logoUrl: form.logoUrl || '',
          bannerUrl: form.bannerUrl || '',
          facebookUrl: form.facebookUrl || '',
          instagramUrl: form.instagramUrl || '',
          websiteUrl: form.websiteUrl || '',
          mapEmbedUrl: form.mapEmbedUrl || '',
          videoUrl: form.videoUrl || '',
          establishedYear: form.establishedYear ? parseInt(form.establishedYear) : null,
          totalStudents: form.totalStudents ? parseInt(form.totalStudents) : null,
          totalTeachers: form.totalTeachers ? parseInt(form.totalTeachers) : null,
          totalPrograms: form.totalPrograms ? parseInt(form.totalPrograms) : null,
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data || 'Failed');
      setMessage(isEditing ? 'School updated successfully!' : 'School created successfully!');
      resetForm();
      fetchSchools();
    } catch (err) { setMessage(err.message); }
    finally { setSubmitting(false); }
  };

  const openEditSchool = (school) => {
    setEditingSchool(school);
    setForm({
      schoolName: school.schoolName || '',
      subdomain: school.subdomain || '',
      primaryColor: school.primaryColor || '#1B2A4A',
      accentColor: school.accentColor || '#C9A84C',
      aboutText: school.aboutText || '',
      address: school.address || '',
      phone: school.phone || '',
      email: school.email || '',
      establishedYear: school.establishedYear || '',
      logoUrl: school.logoUrl || '',
      bannerUrl: school.bannerUrl || '',
      totalStudents: school.totalStudents || '',
      totalTeachers: school.totalTeachers || '',
      totalPrograms: school.totalPrograms || '',
      facebookUrl: school.facebookUrl || '',
      instagramUrl: school.instagramUrl || '',
      websiteUrl: school.websiteUrl || '',
      mapEmbedUrl: school.mapEmbedUrl || '',
      videoUrl: school.videoUrl || '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSchool = async (schoolId, schoolName, isActive) => {
    if (!confirm(`${isActive ? 'Deactivate' : 'Activate'} "${schoolName}"?`)) return;
    try {
      const res = await fetch(`${API}/superadmin/schools/${schoolId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed');
      fetchSchools();
    } catch (err) { alert('Error: ' + err.message); }
  };

  const toggleAdminForm = (schoolId) => {
    setAdminForms(prev => ({ ...prev, [schoolId]: prev[schoolId] ? null : { email: '', password: '' } }));
  };

  const handleCreateAdmin = async (e, schoolId) => {
    e.preventDefault();
    const f = adminForms[schoolId];
    try {
      const res = await fetch(`${API}/superadmin/schools/${schoolId}/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: f.email, password: f.password })
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { message: text }; }
      if (!res.ok) throw new Error(data.message || text || 'Failed');
      setAdminMessages(prev => ({ ...prev, [schoolId]: '✅ Admin created! Email: ' + f.email }));
      setAdminForms(prev => ({ ...prev, [schoolId]: null }));
    } catch (err) {
      setAdminMessages(prev => ({ ...prev, [schoolId]: '❌ ' + err.message }));
    }
  };

  const logout = () => { localStorage.clear(); navigate('/superadmin/login'); };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-[#1B2A4A] text-white flex flex-col">
        <div className="p-6 border-b border-[#243660]">
          <h2 className="text-xl font-bold">Dailo Technology Admin</h2>
          <p className="text-blue-300 text-sm mt-1">Super Administrator</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <div className="bg-[#243660] rounded-lg px-4 py-2.5 text-sm font-medium">All Schools</div>
        </nav>
        <div className="p-4">
          <button onClick={logout} className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition">Logout</button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#1B2A4A]">All Schools</h1>
          <button onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="bg-[#1B2A4A] text-white px-4 py-2 rounded-lg hover:bg-[#243660] transition">
            {showForm && !editingSchool ? 'Cancel' : '+ Add New School'}
          </button>
        </div>

        {message && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${message.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {message}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-lg font-bold text-[#1B2A4A] mb-4">{editingSchool ? `Edit: ${editingSchool.schoolName}` : 'Create New School'}</h2>
            <form onSubmit={handleSubmitSchool} className="grid grid-cols-2 gap-4">

              {/* Basic Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Name *</label>
                <input value={form.schoolName} onChange={e => setForm({ ...form, schoolName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subdomain {editingSchool && <span className="text-gray-400 text-xs">(cannot change)</span>}</label>
                <input value={form.subdomain}
                  onChange={e => !editingSchool && setForm({ ...form, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                  className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A] ${editingSchool ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="e.g. ratobangala" required readOnly={!!editingSchool} />
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                <input type="color" value={form.primaryColor} onChange={e => setForm({ ...form, primaryColor: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
                <input type="color" value={form.accentColor} onChange={e => setForm({ ...form, accentColor: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer" />
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                <input type="number" value={form.establishedYear} onChange={e => setForm({ ...form, establishedYear: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
              </div>

              {/* Stats — no Total Staff */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Students</label>
                <input type="number" value={form.totalStudents || ''} onChange={e => setForm({ ...form, totalStudents: e.target.value })}
                  placeholder="e.g. 500" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Teachers</label>
                <input type="number" value={form.totalTeachers || ''} onChange={e => setForm({ ...form, totalTeachers: e.target.value })}
                  placeholder="e.g. 50" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Programs</label>
                <input type="number" value={form.totalPrograms || ''} onChange={e => setForm({ ...form, totalPrograms: e.target.value })}
                  placeholder="e.g. 25" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
              </div>

              {/* Social */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                <input value={form.facebookUrl || ''} onChange={e => setForm({ ...form, facebookUrl: e.target.value })}
                  placeholder="https://facebook.com/..." className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                <input value={form.instagramUrl || ''} onChange={e => setForm({ ...form, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/..." className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                <input value={form.websiteUrl || ''} onChange={e => setForm({ ...form, websiteUrl: e.target.value })}
                  placeholder="https://..." className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Video URL</label>
                <input value={form.videoUrl || ''} onChange={e => setForm({ ...form, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..." className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL</label>
                <input value={form.mapEmbedUrl || ''} onChange={e => setForm({ ...form, mapEmbedUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/embed?pb=..." className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                <p className="text-xs text-gray-400 mt-1">Google Maps → Share → Embed a map → copy the src URL only</p>
              </div>

              {/* Logo Upload */}
              <ImageUpload label="School Logo" value={form.logoUrl}
                onChange={v => setForm({ ...form, logoUrl: v })}
                hint="Recommended: 200×200px PNG with transparent background" />

              {/* Multi-Banner Upload */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Banner Images (up to 5 for slideshow)</label>
                {(() => {
                  let banners = [];
                  try { banners = JSON.parse(form.bannerUrl || '[]'); if (!Array.isArray(banners)) banners = form.bannerUrl ? [form.bannerUrl] : []; } catch { banners = form.bannerUrl ? [form.bannerUrl] : []; }
                  const updateBanners = (nb) => setForm({ ...form, bannerUrl: JSON.stringify(nb) });
                  return (
                    <div className="space-y-3">
                      {banners.map((b, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <div className="flex-1 flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-lg p-2">
                            {b && <img src={b} alt="banner" className="h-12 w-20 object-cover rounded" />}
                            <span className="text-xs text-gray-500 truncate flex-1">Banner {i+1}</span>
                          </div>
                          <button type="button" onClick={() => updateBanners(banners.filter((_,idx) => idx !== i))}
                            className="text-red-400 hover:text-red-600 px-2">✕</button>
                        </div>
                      ))}
                      {banners.length < 5 && (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <p className="text-xs text-gray-500 mb-2">Add banner {banners.length + 1} of 5</p>
                          <input type="file" accept="image/*" onChange={e => {
                            const file = e.target.files[0]; if (!file) return;
                            const reader = new FileReader();
                            reader.onloadend = () => updateBanners([...banners, reader.result]);
                            reader.readAsDataURL(file);
                          }} className="w-full border border-gray-300 rounded px-2 py-1 text-sm mb-2" />
                          <div className="flex gap-2">
                            <input type="text" placeholder="Or paste URL https://..."
                              id="superadmin-banner-url"
                              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm" />
                            <button type="button" onClick={() => {
                              const input = document.getElementById('superadmin-banner-url');
                              if (input.value) { updateBanners([...banners, input.value]); input.value = ''; }
                            }} className="bg-[#1B2A4A] text-white px-3 py-1 rounded text-sm">Add</button>
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-gray-400">Recommended: 1920×600px JPG. Images rotate as slideshow.</p>
                    </div>
                  );
                })()}
              </div>

              {/* About with MDEditor */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">About School</label>
                <div data-color-mode="light">
                  <MDEditor
                    value={form.aboutText}
                    onChange={val => setForm({ ...form, aboutText: val || '' })}
                    preview="edit"
                    height={250}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Use the toolbar to add headings, bold, lists, etc.</p>
              </div>

              <div className="col-span-2 flex gap-3">
                <button type="submit" disabled={submitting}
                  className="bg-[#1B2A4A] text-white px-6 py-2 rounded-lg hover:bg-[#243660] transition disabled:opacity-50">
                  {submitting ? 'Saving...' : editingSchool ? 'Update School' : 'Create School'}
                </button>
                <button type="button" onClick={resetForm}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading schools...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schools.map(school => (
              <div key={school.id} className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center gap-3 mb-3">
                  {school.logoUrl ? (
                    <img src={school.logoUrl} alt={school.schoolName} className="w-10 h-10 rounded-full object-contain border border-gray-200 p-0.5" />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: school.primaryColor }}>
                      {school.schoolName[0]}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-800">{school.schoolName}</h3>
                    <p className="text-sm text-gray-500">{school.subdomain}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1 mb-3">
                  <p>📍 {school.address || 'No address'}</p>
                  <p>📧 {school.email || 'No email'}</p>
                  <p>📅 Est. {school.establishedYear || 'N/A'}</p>
                </div>
                {(school.totalStudents || school.totalTeachers || school.totalPrograms) && (
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {school.totalStudents && <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">👥 {school.totalStudents}+ Students</span>}
                    {school.totalTeachers && <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">👨‍🏫 {school.totalTeachers}+ Teachers</span>}
                    {school.totalPrograms && <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">📚 {school.totalPrograms}+ Programs</span>}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${school.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {school.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <a href={`https://lmsschool.netlify.app/${school.subdomain}`} target="_blank"
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition">
                    View Site
                  </a>
                  <button onClick={() => openEditSchool(school)}
                    className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium hover:bg-yellow-200 transition">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteSchool(school.id, school.schoolName, school.isActive)}
                    className={`px-2 py-1 rounded-full text-xs font-medium transition ${school.isActive ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                    {school.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
                <button onClick={() => toggleAdminForm(school.id)}
                  className="w-full text-sm bg-[#C9A84C] text-white px-3 py-1.5 rounded-lg hover:bg-[#b8943f] transition font-medium">
                  {adminForms[school.id] ? 'Cancel' : '+ Create Admin Account'}
                </button>
                {adminMessages[school.id] && (
                  <p className={`mt-2 text-xs ${adminMessages[school.id].includes('✅') ? 'text-green-600' : 'text-red-500'}`}>
                    {adminMessages[school.id]}
                  </p>
                )}
                {adminForms[school.id] && (
                  <form onSubmit={(e) => handleCreateAdmin(e, school.id)} className="mt-3 space-y-2">
                    <input type="email" placeholder="Admin email"
                      value={adminForms[school.id].email}
                      onChange={e => setAdminForms(prev => ({ ...prev, [school.id]: { ...prev[school.id], email: e.target.value } }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" required />
                    <input type="password" placeholder="Admin password"
                      value={adminForms[school.id].password}
                      onChange={e => setAdminForms(prev => ({ ...prev, [school.id]: { ...prev[school.id], password: e.target.value } }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" required />
                    <button type="submit"
                      className="w-full bg-[#1B2A4A] text-white px-3 py-1.5 rounded-lg text-sm hover:bg-[#243660] transition">
                      Create Admin
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
