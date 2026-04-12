import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5071/api';

export default function SuperAdminDashboard() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    schoolName: '', subdomain: '', primaryColor: '#1B2A4A',
    accentColor: '#C9A84C', aboutText: '', address: '',
    phone: '', email: '', establishedYear: ''
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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchool = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      const res = await fetch(`${API}/school`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, establishedYear: parseInt(form.establishedYear) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data || 'Failed to create school');
      setMessage('School created successfully!');
      setShowForm(false);
      setForm({ schoolName: '', subdomain: '', primaryColor: '#1B2A4A', accentColor: '#C9A84C', aboutText: '', address: '', phone: '', email: '', establishedYear: '' });
      fetchSchools();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAdminForm = (schoolId) => {
    setAdminForms(prev => ({
      ...prev,
      [schoolId]: prev[schoolId] ? null : { email: '', password: '' }
    }));
  };

  const handleCreateAdmin = async (e, schoolId) => {
    e.preventDefault();
    const form = adminForms[schoolId];
    try {
      const res = await fetch(`${API}/superadmin/schools/${schoolId}/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data || 'Failed to create admin');
      setAdminMessages(prev => ({ ...prev, [schoolId]: '✅ Admin created! Email: ' + form.email }));
      setAdminForms(prev => ({ ...prev, [schoolId]: null }));
    } catch (err) {
      setAdminMessages(prev => ({ ...prev, [schoolId]: '❌ ' + err.message }));
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-[#1B2A4A] text-white flex flex-col">
        <div className="p-6 border-b border-[#243660]">
          <h2 className="text-xl font-bold">ItexGiti Admin</h2>
          <p className="text-blue-300 text-sm mt-1">Super Administrator</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <div className="bg-[#243660] rounded-lg px-4 py-2.5 text-sm font-medium">All Schools</div>
        </nav>
        <div className="p-4">
          <button onClick={logout} className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition">
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#1B2A4A]">All Schools</h1>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-[#1B2A4A] text-white px-4 py-2 rounded-lg hover:bg-[#243660] transition">
            {showForm ? 'Cancel' : '+ Add New School'}
          </button>
        </div>

        {message && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${message.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {message}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-lg font-bold text-[#1B2A4A] mb-4">Create New School</h2>
            <form onSubmit={handleCreateSchool} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                <input value={form.schoolName} onChange={e => setForm({...form, schoolName: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subdomain (no spaces, lowercase)</label>
                <input value={form.subdomain} onChange={e => setForm({...form, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
                  placeholder="e.g. ratobangala" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                <input type="color" value={form.primaryColor} onChange={e => setForm({...form, primaryColor: e.target.value})}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
                <input type="color" value={form.accentColor} onChange={e => setForm({...form, accentColor: e.target.value})}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                <input type="number" value={form.establishedYear} onChange={e => setForm({...form, establishedYear: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">About Text</label>
                <textarea value={form.aboutText} onChange={e => setForm({...form, aboutText: e.target.value})}
                  rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
              </div>
              <div className="col-span-2">
                <button type="submit" disabled={submitting}
                  className="bg-[#1B2A4A] text-white px-6 py-2 rounded-lg hover:bg-[#243660] transition disabled:opacity-50">
                  {submitting ? 'Creating...' : 'Create School'}
                </button>
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
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: school.primaryColor }}>
                    {school.schoolName[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{school.schoolName}</h3>
                    <p className="text-sm text-gray-500">{school.subdomain}</p>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <p>📍 {school.address || 'No address'}</p>
                  <p>📧 {school.email || 'No email'}</p>
                  <p>📅 Est. {school.establishedYear || 'N/A'}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${school.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {school.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <a href={`https://lmsschool.netlify.app?school=${school.subdomain}`} target="_blank"
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition">
                    View Site
                  </a>
                </div>

                <button
                  onClick={() => toggleAdminForm(school.id)}
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
                    <input
                      type="email"
                      placeholder="Admin email"
                      value={adminForms[school.id].email}
                      onChange={e => setAdminForms(prev => ({ ...prev, [school.id]: { ...prev[school.id], email: e.target.value } }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
                      required
                    />
                    <input
                      type="password"
                      placeholder="Admin password"
                      value={adminForms[school.id].password}
                      onChange={e => setAdminForms(prev => ({ ...prev, [school.id]: { ...prev[school.id], password: e.target.value } }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
                      required
                    />
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
