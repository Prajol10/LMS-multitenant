import CalendarManager from '../../components/admin/CalendarManager';
import { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { useNavigate, useParams } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5071/api';

const CLASS_LEVELS = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11', 'Class 12',
  'Class 1-5 (Primary)', 'Class 6-8 (Lower Secondary)',
  'Class 9-10 (Secondary)', 'Class 11-12 (Higher Secondary)',
  'Class 1-10', 'Class 1-12', 'All Classes'
];

const ImageUpload = ({ label, value, onChange, hint }) => {
  const [mode, setMode] = useState('url');
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex gap-2 mb-2">
        {['url', 'file'].map(m => (
          <button key={m} type="button" onClick={() => setMode(m)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${mode === m ? 'bg-[#1B2A4A] text-white' : 'bg-gray-100 text-gray-700'}`}>
            {m === 'url' ? 'Paste URL' : 'Upload File'}
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
          {value?.startsWith('data:') && (
            <img src={value} alt="Preview" className="mt-2 h-24 object-contain rounded-lg border border-gray-200 p-1 bg-gray-50" />
          )}
        </div>
      )}
      {hint && <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-600">{hint}</div>}
    </div>
  );
};

export default function Dashboard() {
  const { school } = useParams();
  const storedSchool = localStorage.getItem('school') || school;
  const [activeTab, setActiveTab] = useState('notices');
  const [notices, setNotices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [messages, setMessages] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [students, setStudents] = useState([]);
  const [leadership, setLeadership] = useState([]);
  const [showLeadershipForm, setShowLeadershipForm] = useState(false);
  const [editingLeadership, setEditingLeadership] = useState(null);
  const [leadershipForm, setLeadershipForm] = useState({ name: '', title: '', content: '', imageUrl: '', sortOrder: 0 });
  const [schoolInfo, setSchoolInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', isImportant: false });
  const [galleryForm, setGalleryForm] = useState({ imageUrl: '', caption: '', uploadMode: 'url' });
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [showProgramForm, setShowProgramForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [programForm, setProgramForm] = useState({ title: '', description: '', duration: '', level: '', imageUrl: '' });
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentForm, setStudentForm] = useState({ name: '', grade: '', achievement: '', imageUrl: '' });
  const [message, setMessage] = useState('');
  const [editingInfo, setEditingInfo] = useState(false);
  const [infoForm, setInfoForm] = useState({});
  const [savingInfo, setSavingInfo] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API}/admin/school`, { headers: { Authorization: `Bearer ${token}` } });
      const s = await res.json();
      setSchoolInfo(s);
      setInfoForm({
        schoolName: s.schoolName || '', aboutText: s.aboutText || '',
        address: s.address || '', phone: s.phone || '', email: s.email || '',
        establishedYear: s.establishedYear || '', logoUrl: s.logoUrl || '',
        bannerUrl: s.bannerUrl || '', facebookUrl: s.facebookUrl || '',
        instagramUrl: s.instagramUrl || '', websiteUrl: s.websiteUrl || '',
        mapEmbedUrl: s.mapEmbedUrl || '', videoUrl: s.videoUrl || '',
        aboutImageUrl: s.aboutImageUrl || '', primaryColor: s.primaryColor || '#1B2A4A',
        accentColor: s.accentColor || '#C9A84C',
      });
      const [noticesRes, galleryRes, messagesRes, programsRes, studentsRes] = await Promise.all([
        fetch(`${API}/school/${s.subdomain}/notices`),
        fetch(`${API}/school/${s.subdomain}/gallery`),
        fetch(`${API}/admin/messages`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/admin/programs`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/admin/students`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/admin/leadership`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setNotices(await noticesRes.json());
      setGallery(await galleryRes.json());
      if (messagesRes.ok) setMessages(await messagesRes.json());
      if (programsRes.ok) setPrograms(await programsRes.json());
      if (studentsRes.ok) setStudents(await studentsRes.json());
      const lRes = await fetch(`${API}/admin/leadership`, { headers: { Authorization: `Bearer ${token}` } });
      if (lRes.ok) setLeadership(await lRes.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const showMsg = (text) => { setMessage(text); setTimeout(() => setMessage(''), 4000); };

  const addNotice = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/notice`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(noticeForm)
    });
    if (res.ok) { showMsg('Notice added!'); setShowNoticeForm(false); setNoticeForm({ title: '', content: '', isImportant: false }); fetchData(); }
  };

  const deleteNotice = async (id) => {
    if (!confirm('Delete this notice?')) return;
    await fetch(`${API}/notice/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  };

  const addGalleryImage = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/gallery`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ imageUrl: galleryForm.imageUrl, caption: galleryForm.caption })
    });
    if (res.ok) { showMsg('Image added!'); setShowGalleryForm(false); setGalleryForm({ imageUrl: '', caption: '', uploadMode: 'url' }); fetchData(); }
  };

  const deleteGalleryImage = async (id) => {
    if (!confirm('Delete this image?')) return;
    await fetch(`${API}/gallery/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  };

  const saveSchoolInfo = async (e) => {
    e.preventDefault(); setSavingInfo(true);
    const res = await fetch(`${API}/admin/school`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...infoForm, establishedYear: infoForm.establishedYear ? parseInt(infoForm.establishedYear) : null, totalStudents: infoForm.totalStudents ? parseInt(infoForm.totalStudents) : null, totalTeachers: infoForm.totalTeachers ? parseInt(infoForm.totalTeachers) : null, totalPrograms: infoForm.totalPrograms ? parseInt(infoForm.totalPrograms) : null, totalStaff: infoForm.totalStaff ? parseInt(infoForm.totalStaff) : null })
    });
    if (res.ok) { showMsg('School info saved!'); setEditingInfo(false); fetchData(); }
    setSavingInfo(false);
  };

  const markMessageRead = async (id) => {
    await fetch(`${API}/admin/messages/${id}/read`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
  };

  const deleteMessage = async (id) => {
    if (!confirm('Delete this message?')) return;
    await fetch(`${API}/admin/messages/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const saveProgram = async (e) => {
    e.preventDefault();
    const url = editingProgram ? `${API}/admin/programs/${editingProgram.id}` : `${API}/admin/programs`;
    const res = await fetch(url, {
      method: editingProgram ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(programForm)
    });
    if (res.ok) {
      showMsg(editingProgram ? 'Program updated!' : 'Program added!');
      setShowProgramForm(false); setEditingProgram(null);
      setProgramForm({ title: '', description: '', duration: '', level: '', imageUrl: '' });
      fetchData();
    }
  };

  const deleteProgram = async (id) => {
    if (!confirm('Delete this program?')) return;
    await fetch(`${API}/admin/programs/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  };

  const saveStudent = async (e) => {
    e.preventDefault();
    const url = editingStudent ? `${API}/admin/students/${editingStudent.id}` : `${API}/admin/students`;
    const res = await fetch(url, {
      method: editingStudent ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(studentForm)
    });
    if (res.ok) {
      showMsg(editingStudent ? 'Student updated!' : 'Student added!');
      setShowStudentForm(false); setEditingStudent(null);
      setStudentForm({ name: '', grade: '', achievement: '', imageUrl: '' });
      fetchData();
    }
  };

  const deleteStudent = async (id) => {
    if (!confirm('Delete this student?')) return;
    await fetch(`${API}/admin/students/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  };

  const saveLeadership = async (e) => {
    e.preventDefault();
    const url = editingLeadership ? `${API}/admin/leadership/${editingLeadership.id}` : `${API}/admin/leadership`;
    const res = await fetch(url, {
      method: editingLeadership ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...leadershipForm, sortOrder: parseInt(leadershipForm.sortOrder) || 0 })
    });
    if (res.ok) {
      showMsg(editingLeadership ? 'Message updated!' : 'Message added!');
      setShowLeadershipForm(false); setEditingLeadership(null);
      setLeadershipForm({ name: '', title: '', content: '', imageUrl: '', sortOrder: 0 });
      fetchData();
    }
  };

  const deleteLeadership = async (id) => {
    if (!confirm('Delete this message?')) return;
    await fetch(`${API}/admin/leadership/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  };

  const logout = () => { localStorage.clear(); navigate(`/${storedSchool}/admin`); };

  const tabs = [
    { id: 'notices', label: 'Notices' },
    { id: 'leadership', label: 'Leadership Messages' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'programs', label: 'Programs' },
    { id: 'students', label: 'Students' },
    { id: 'messages', label: 'Messages', badge: messages.filter(m => !m.isRead).length },
    { id: 'info', label: 'School Info' },
    { id: 'calendar', label: 'Calendar' },
  ];

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-[#1B2A4A] text-white flex flex-col">
        <div className="p-6 border-b border-[#243660]">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-2"
            style={{ backgroundColor: schoolInfo?.primaryColor || '#C9A84C' }}>
            {schoolInfo?.schoolName?.[0] || 'S'}
          </div>
          <h2 className="text-lg font-bold">{schoolInfo?.schoolName || 'School'}</h2>
          <p className="text-blue-300 text-sm">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-between ${activeTab === tab.id ? 'bg-[#243660]' : 'hover:bg-[#243660]/50'}`}>
              <span>{tab.label}</span>
              {tab.badge > 0 && <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{tab.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 space-y-2">
          <a href={`/${storedSchool}`} className="block w-full text-center bg-[#243660] hover:bg-[#2d4580] text-white px-4 py-2 rounded-lg text-sm transition">View Public Site</a>
          <button onClick={logout} className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition">Logout</button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        {message && (
          <div className="mb-4 px-4 py-3 bg-green-50 text-green-600 rounded-lg text-sm flex justify-between">
            {message}<button onClick={() => setMessage('')}>✕</button>
          </div>
        )}

        {/* NOTICES */}
        {activeTab === 'notices' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-[#1B2A4A]">Notices</h1>
              <button onClick={() => setShowNoticeForm(!showNoticeForm)} className="bg-[#1B2A4A] text-white px-4 py-2 rounded-lg hover:bg-[#243660] transition">
                {showNoticeForm ? 'Cancel' : '+ Add Notice'}
              </button>
            </div>
            {showNoticeForm && (
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <form onSubmit={addNotice} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input value={noticeForm.title} onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea value={noticeForm.content} onChange={e => setNoticeForm({ ...noticeForm, content: e.target.value })}
                      rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" required />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={noticeForm.isImportant} onChange={e => setNoticeForm({ ...noticeForm, isImportant: e.target.checked })} className="w-4 h-4" />
                    <span className="text-sm font-medium text-gray-700">Mark as Important</span>
                  </label>
                  <button type="submit" className="bg-[#1B2A4A] text-white px-6 py-2 rounded-lg hover:bg-[#243660] transition">Add Notice</button>
                </form>
              </div>
            )}
            <div className="space-y-4">
              {notices.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">No notices yet!</div>
              ) : notices.map(notice => (
                <div key={notice.id} className={`bg-white rounded-xl shadow p-5 border-l-4 ${notice.isImportant ? 'border-red-500' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-800">{notice.title}</h3>
                        {notice.isImportant && <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">Important</span>}
                      </div>
                      <p className="text-gray-600 text-sm">{notice.content}</p>
                      <p className="text-gray-400 text-xs mt-2">{new Date(notice.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => deleteNotice(notice.id)} className="text-red-400 hover:text-red-600 text-sm ml-4">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GALLERY */}
        {activeTab === 'gallery' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-[#1B2A4A]">Gallery</h1>
              <button onClick={() => setShowGalleryForm(!showGalleryForm)} className="bg-[#1B2A4A] text-white px-4 py-2 rounded-lg hover:bg-[#243660] transition">
                {showGalleryForm ? 'Cancel' : '+ Add Image'}
              </button>
            </div>
            {showGalleryForm && (
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <form onSubmit={addGalleryImage} className="space-y-4">
                  <div className="flex gap-3 mb-2">
                    {['url', 'file'].map(m => (
                      <button key={m} type="button" onClick={() => setGalleryForm({ ...galleryForm, uploadMode: m })}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${galleryForm.uploadMode === m ? 'bg-[#1B2A4A] text-white' : 'bg-gray-100 text-gray-700'}`}>
                        {m === 'url' ? 'Paste URL' : 'Upload from Device'}
                      </button>
                    ))}
                  </div>
                  {galleryForm.uploadMode === 'url' ? (
                    <input value={galleryForm.imageUrl} onChange={e => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" placeholder="https://..." />
                  ) : (
                    <div>
                      <input type="file" accept="image/*" onChange={e => {
                        const file = e.target.files[0]; if (!file) return;
                        const reader = new FileReader();
                        reader.onloadend = () => setGalleryForm({ ...galleryForm, imageUrl: reader.result });
                        reader.readAsDataURL(file);
                      }} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                      {galleryForm.imageUrl?.startsWith('data:') && <img src={galleryForm.imageUrl} alt="Preview" className="mt-2 h-32 object-cover rounded-lg" />}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                    <input value={galleryForm.caption} onChange={e => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                  </div>
                  <button type="submit" className="bg-[#1B2A4A] text-white px-6 py-2 rounded-lg hover:bg-[#243660] transition">Add Image</button>
                </form>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.length === 0 ? (
                <div className="col-span-3 bg-white rounded-xl shadow p-8 text-center text-gray-400">No images yet!</div>
              ) : gallery.map(img => (
                <div key={img.id} className="bg-white rounded-xl shadow overflow-hidden">
                  <img src={img.imageUrl} alt={img.caption} className="w-full h-48 object-cover" />
                  <div className="p-3 flex justify-between items-center">
                    <p className="text-sm text-gray-600 truncate">{img.caption}</p>
                    <button onClick={() => deleteGalleryImage(img.id)} className="text-red-400 hover:text-red-600 text-sm ml-2">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LEADERSHIP MESSAGES */}
        {activeTab === 'leadership' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-[#1B2A4A]">Leadership Messages</h1>
              <button onClick={() => { setShowLeadershipForm(!showLeadershipForm); setEditingLeadership(null); setLeadershipForm({ name: '', title: '', content: '', imageUrl: '', sortOrder: 0 }); }}
                className="bg-[#1B2A4A] text-white px-4 py-2 rounded-lg hover:bg-[#243660] transition">
                {showLeadershipForm ? 'Cancel' : '+ Add Message'}
              </button>
            </div>
            {showLeadershipForm && (
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h2 className="text-lg font-bold text-[#1B2A4A] mb-4">{editingLeadership ? 'Edit Message' : 'New Leadership Message'}</h2>
                <form onSubmit={saveLeadership} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input value={leadershipForm.name} onChange={e => setLeadershipForm({ ...leadershipForm, name: e.target.value })}
                        placeholder="e.g. Milan Dixit" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title / Role *</label>
                      <input value={leadershipForm.title} onChange={e => setLeadershipForm({ ...leadershipForm, title: e.target.value })}
                        placeholder="e.g. Message from the Principal" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                      <div className="flex gap-2 mb-2">
                        {['file','url'].map(m => (
                          <button key={m} type="button" onClick={() => setLeadershipForm({ ...leadershipForm, photoMode: m })}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${(leadershipForm.photoMode||'file')===m?'bg-[#1B2A4A] text-white':'bg-gray-100 text-gray-700'}`}>
                            {m==='file'?'Upload from Device':'Paste URL'}
                          </button>
                        ))}
                      </div>
                      {(leadershipForm.photoMode||'file')==='url' ? (
                        <input value={leadershipForm.imageUrl||''} onChange={e => setLeadershipForm({ ...leadershipForm, imageUrl: e.target.value })}
                          placeholder="https://..." className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                      ) : (
                        <div>
                          <input type="file" accept="image/*" onChange={e => {
                            const file = e.target.files[0]; if (!file) return;
                            const reader = new FileReader();
                            reader.onloadend = () => setLeadershipForm({ ...leadershipForm, imageUrl: reader.result });
                            reader.readAsDataURL(file);
                          }} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                          {leadershipForm.imageUrl && (
                            <img src={leadershipForm.imageUrl} alt="Preview" className="mt-2 h-24 w-24 object-cover rounded-lg border border-gray-200" />
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Order (0 = first)</label>
                      <input type="number" value={leadershipForm.sortOrder} onChange={e => setLeadershipForm({ ...leadershipForm, sortOrder: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message Content</label>
                    <textarea value={leadershipForm.content} onChange={e => setLeadershipForm({ ...leadershipForm, content: e.target.value })}
                      rows={5} placeholder="Write the message here..." className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="bg-[#1B2A4A] text-white px-6 py-2 rounded-lg hover:bg-[#243660] transition">
                      {editingLeadership ? 'Update Message' : 'Add Message'}
                    </button>
                    <button type="button" onClick={() => { setShowLeadershipForm(false); setEditingLeadership(null); }}
                      className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                  </div>
                </form>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leadership.length === 0 ? (
                <div className="col-span-2 bg-white rounded-xl shadow p-8 text-center text-gray-400">
                  No leadership messages yet — add Principal or Director messages!
                </div>
              ) : leadership.map(msg => (
                <div key={msg.id} className="bg-white rounded-xl shadow overflow-hidden">
                  {msg.imageUrl && <img src={msg.imageUrl} alt={msg.name} className="w-full h-48 object-cover object-top" />}
                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{msg.title}</p>
                    <h3 className="font-bold text-gray-800 text-lg">{msg.name}</h3>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-3">{msg.content}</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => { setEditingLeadership(msg); setLeadershipForm({ name: msg.name, title: msg.title || '', content: msg.content || '', imageUrl: msg.imageUrl || '', sortOrder: msg.sortOrder || 0 }); setShowLeadershipForm(true); }}
                        className="text-blue-400 hover:text-blue-600 text-sm">Edit</button>
                      <button onClick={() => deleteLeadership(msg.id)} className="text-red-400 hover:text-red-600 text-sm">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROGRAMS */}
        {activeTab === 'programs' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-[#1B2A4A]">Programs & Courses</h1>
              <button onClick={() => { setShowProgramForm(!showProgramForm); setEditingProgram(null); setProgramForm({ title: '', description: '', duration: '', level: '', imageUrl: '' }); }}
                className="bg-[#1B2A4A] text-white px-4 py-2 rounded-lg hover:bg-[#243660] transition">
                {showProgramForm ? 'Cancel' : '+ Add Program'}
              </button>
            </div>
            {showProgramForm && (
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h2 className="text-lg font-bold text-[#1B2A4A] mb-4">{editingProgram ? 'Edit Program' : 'New Program'}</h2>
                <form onSubmit={saveProgram} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Program Title *</label>
                      <input value={programForm.title} onChange={e => setProgramForm({ ...programForm, title: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Class / Level</label>
                      <select value={programForm.level} onChange={e => setProgramForm({ ...programForm, level: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]">
                        <option value="">Select class/level</option>
                        {CLASS_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <input value={programForm.duration} onChange={e => setProgramForm({ ...programForm, duration: e.target.value })}
                        placeholder="e.g. 1 year, 2 years" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input value={programForm.imageUrl} onChange={e => setProgramForm({ ...programForm, imageUrl: e.target.value })}
                        placeholder="https://..." className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={programForm.description} onChange={e => setProgramForm({ ...programForm, description: e.target.value })}
                      rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="bg-[#1B2A4A] text-white px-6 py-2 rounded-lg hover:bg-[#243660] transition">
                      {editingProgram ? 'Update Program' : 'Add Program'}
                    </button>
                    <button type="button" onClick={() => { setShowProgramForm(false); setEditingProgram(null); }}
                      className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                  </div>
                </form>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {programs.length === 0 ? (
                <div className="col-span-2 bg-white rounded-xl shadow p-8 text-center text-gray-400">No programs yet!</div>
              ) : programs.map(p => (
                <div key={p.id} className="bg-white rounded-xl shadow overflow-hidden flex">
                  {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="w-28 h-full object-cover flex-shrink-0" />}
                  <div className="p-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800">{p.title}</h3>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {p.level && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">{p.level}</span>}
                          {p.duration && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">⏱ {p.duration}</span>}
                        </div>
                        {p.description && <p className="text-gray-500 text-sm mt-2 line-clamp-2">{p.description}</p>}
                      </div>
                      <div className="flex flex-col gap-1 ml-2">
                        <button onClick={() => { setEditingProgram(p); setProgramForm({ title: p.title, description: p.description || '', duration: p.duration || '', level: p.level || '', imageUrl: p.imageUrl || '' }); setShowProgramForm(true); }}
                          className="text-blue-400 hover:text-blue-600 text-sm">Edit</button>
                        <button onClick={() => deleteProgram(p.id)} className="text-red-400 hover:text-red-600 text-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STUDENTS */}
        {activeTab === 'students' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-[#1B2A4A]">Students</h1>
              <button onClick={() => { setShowStudentForm(!showStudentForm); setEditingStudent(null); setStudentForm({ name: '', grade: '', achievement: '', imageUrl: '' }); }}
                className="bg-[#1B2A4A] text-white px-4 py-2 rounded-lg hover:bg-[#243660] transition">
                {showStudentForm ? 'Cancel' : '+ Add Student'}
              </button>
            </div>
            {showStudentForm && (
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h2 className="text-lg font-bold text-[#1B2A4A] mb-4">{editingStudent ? 'Edit Student' : 'New Student'}</h2>
                <form onSubmit={saveStudent} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
                      <input value={studentForm.name} onChange={e => setStudentForm({ ...studentForm, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Grade / Class</label>
                      <select value={studentForm.grade} onChange={e => setStudentForm({ ...studentForm, grade: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]">
                        <option value="">Select grade</option>
                        {['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12'].map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Achievement</label>
                      <input value={studentForm.achievement} onChange={e => setStudentForm({ ...studentForm, achievement: e.target.value })}
                        placeholder="e.g. Top Scorer, Best Athlete"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">About / Description</label>
                      <textarea value={studentForm.about||''} onChange={e => setStudentForm({ ...studentForm, about: e.target.value })}
                        rows={3} placeholder="e.g. Passionate about science and mathematics. School captain 2024."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Student Photo</label>
                      <div className="flex gap-2 mb-2">
                        {['url','file'].map(m => (
                          <button key={m} type="button" onClick={() => setStudentForm({ ...studentForm, photoMode: m })}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${(studentForm.photoMode||'file')===m?'bg-[#1B2A4A] text-white':'bg-gray-100 text-gray-700'}`}>
                            {m==='url'?'Paste URL':'Upload from Device'}
                          </button>
                        ))}
                      </div>
                      {(studentForm.photoMode||'file')==='url'?(
                        <input value={studentForm.imageUrl||''} onChange={e=>setStudentForm({...studentForm,imageUrl:e.target.value})}
                          placeholder="https://..." className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                      ):(
                        <div>
                          <input type="file" accept="image/*" onChange={e=>{
                            const file=e.target.files[0];if(!file)return;
                            const reader=new FileReader();
                            reader.onloadend=()=>setStudentForm({...studentForm,imageUrl:reader.result});
                            reader.readAsDataURL(file);
                          }} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                          {studentForm.imageUrl&&(
                            <img src={studentForm.imageUrl} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded-full border-2 border-gray-200" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="bg-[#1B2A4A] text-white px-6 py-2 rounded-lg hover:bg-[#243660] transition">
                      {editingStudent ? 'Update Student' : 'Add Student'}
                    </button>
                    <button type="button" onClick={() => { setShowStudentForm(false); setEditingStudent(null); }}
                      className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                  </div>
                </form>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {students.length === 0 ? (
                <div className="col-span-4 bg-white rounded-xl shadow p-8 text-center text-gray-400">No students yet — add your first student!</div>
              ) : students.map(s => (
                <div key={s.id} className="bg-white rounded-xl shadow p-4 text-center">
                  {s.imageUrl ? (
                    <img src={s.imageUrl} alt={s.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2 border-gray-200" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[#1B2A4A] text-white flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                      {s.name.charAt(0)}
                    </div>
                  )}
                  <h3 className="font-bold text-gray-800 text-sm">{s.name}</h3>
                  {s.grade && <p className="text-xs text-gray-500 mt-0.5">{s.grade}</p>}
                  {s.achievement && <p className="text-xs text-yellow-600 mt-1">🏆 {s.achievement}</p>}
                  <div className="flex gap-2 justify-center mt-3">
                    <button onClick={() => { setEditingStudent(s); setStudentForm({ name: s.name, grade: s.grade || '', achievement: s.achievement || '', imageUrl: s.imageUrl || '' }); setShowStudentForm(true); }}
                      className="text-blue-400 hover:text-blue-600 text-xs">Edit</button>
                    <button onClick={() => deleteStudent(s.id)} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MESSAGES */}
        {activeTab === 'messages' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-[#1B2A4A]">
                Messages
                {messages.filter(m => !m.isRead).length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-sm rounded-full">{messages.filter(m => !m.isRead).length} unread</span>
                )}
              </h1>
            </div>
            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
                  <p>No messages yet.</p>
                  <p className="text-sm mt-2">Messages sent through the contact form on your public site will appear here.</p>
                </div>
              ) : messages.map(msg => (
                <div key={msg.id} className={`bg-white rounded-xl shadow p-5 border-l-4 ${msg.isRead ? 'border-gray-200' : 'border-blue-500'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-800">{msg.name}</h3>
                        {!msg.isRead && <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">New</span>}
                      </div>
                      <p className="text-sm text-gray-500">{msg.email}{msg.phone ? ` · ${msg.phone}` : ''}</p>
                      <p className="text-gray-700 mt-2 text-sm">{msg.message}</p>
                      <p className="text-gray-400 text-xs mt-2">{new Date(msg.createdAt).toLocaleString()}</p>
                      <a href={`mailto:${msg.email}`}
                        className="inline-block mt-2 px-3 py-1 bg-[#1B2A4A] text-white text-xs rounded-lg hover:bg-[#243660] transition">
                        Reply via Email
                      </a>
                    </div>
                    <div className="flex flex-col gap-1 ml-4">
                      {!msg.isRead && (
                        <button onClick={() => markMessageRead(msg.id)} className="text-blue-400 hover:text-blue-600 text-sm whitespace-nowrap">Mark Read</button>
                      )}
                      <button onClick={() => deleteMessage(msg.id)} className="text-red-400 hover:text-red-600 text-sm">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCHOOL INFO */}
        {activeTab === 'info' && schoolInfo && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-[#1B2A4A]">School Information</h1>
              {!editingInfo && (
                <button onClick={() => setEditingInfo(true)} className="bg-[#1B2A4A] text-white px-4 py-2 rounded-lg hover:bg-[#243660] transition">Edit Info</button>
              )}
            </div>
            {editingInfo ? (
              <div className="bg-white rounded-xl shadow p-6">
                <form onSubmit={saveSchoolInfo} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                      <input value={infoForm.schoolName} onChange={e => setInfoForm({ ...infoForm, schoolName: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                      <input type="number" value={infoForm.establishedYear} onChange={e => setInfoForm({ ...infoForm, establishedYear: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input value={infoForm.address} onChange={e => setInfoForm({ ...infoForm, address: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input value={infoForm.phone} onChange={e => setInfoForm({ ...infoForm, phone: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" value={infoForm.email} onChange={e => setInfoForm({ ...infoForm, email: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                      <input type="color" value={infoForm.primaryColor} onChange={e => setInfoForm({ ...infoForm, primaryColor: e.target.value })}
                        className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
                      <input type="color" value={infoForm.accentColor} onChange={e => setInfoForm({ ...infoForm, accentColor: e.target.value })}
                        className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Students</label>
                      <input type="number" value={infoForm.totalStudents || ''} onChange={e => setInfoForm({ ...infoForm, totalStudents: e.target.value })}
                        placeholder="e.g. 500" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Teachers</label>
                      <input type="number" value={infoForm.totalTeachers || ''} onChange={e => setInfoForm({ ...infoForm, totalTeachers: e.target.value })}
                        placeholder="e.g. 50" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                    </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Banner Images (up to 5 for slideshow)</label>
                    {(() => {
                      let banners = [];
                      try { banners = JSON.parse(infoForm.bannerUrl || '[]'); if (!Array.isArray(banners)) banners = banners ? [banners] : []; } catch { banners = infoForm.bannerUrl ? [infoForm.bannerUrl] : []; }
                      const updateBanners = (newBanners) => setInfoForm({ ...infoForm, bannerUrl: JSON.stringify(newBanners) });
                      return (
                        <div className="space-y-3">
                          {banners.map((b, i) => (
                            <div key={i} className="flex gap-2 items-center">
                              <div className="flex-1 flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-lg p-2">
                                {b && <img src={b} alt="banner" className="h-12 w-20 object-cover rounded" />}
                                <span className="text-xs text-gray-500 truncate flex-1">{b ? 'Image ' + (i+1) : 'Empty'}</span>
                              </div>
                              <button type="button" onClick={() => { const nb = banners.filter((_, idx) => idx !== i); updateBanners(nb); }}
                                className="text-red-400 hover:text-red-600 text-sm px-2">✕</button>
                            </div>
                          ))}
                          {banners.length < 5 && (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                              <p className="text-xs text-gray-500 mb-2">Add banner image {banners.length + 1} of 5</p>
                              <div className="flex gap-2 mb-2">
                                <label className="flex-1">
                                  <span className="block text-xs text-gray-600 mb-1">Upload from device</span>
                                  <input type="file" accept="image/*" onChange={e => {
                                    const file = e.target.files[0]; if (!file) return;
                                    const reader = new FileReader();
                                    reader.onloadend = () => updateBanners([...banners, reader.result]);
                                    reader.readAsDataURL(file);
                                  }} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" />
                                </label>
                              </div>
                              <div>
                                <span className="block text-xs text-gray-600 mb-1">Or paste URL</span>
                                <div className="flex gap-2">
                                  <input type="text" placeholder="https://..."

        {activeTab === "calendar" && (
          <CalendarManager tenantId={schoolInfo?.id} />
        )}
                                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (e.target.value) { updateBanners([...banners, e.target.value]); e.target.value = ''; } } }}
                                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm" />
                                  <button type="button" onClick={e => { const input = e.target.previousSibling; if (input.value) { updateBanners([...banners, input.value]); input.value = ''; } }}
                                    className="bg-[#1B2A4A] text-white px-3 py-1 rounded text-sm">Add</button>
                                </div>
                              </div>
                            </div>
                          )}
                          <p className="text-xs text-gray-400">Recommended: 1920×600px JPG. These images will rotate as slideshow on homepage.</p>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: 'facebookUrl', label: 'Facebook URL', placeholder: 'https://facebook.com/...' },
                      { key: 'instagramUrl', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
                      { key: 'websiteUrl', label: 'Website URL', placeholder: 'https://...' },
                      { key: 'videoUrl', label: 'YouTube Video URL', placeholder: 'https://youtube.com/watch?v=...' },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                        <input value={infoForm[key] || ''} onChange={e => setInfoForm({ ...infoForm, [key]: e.target.value })}
                          placeholder={placeholder} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL</label>
                    <input value={infoForm.mapEmbedUrl || ''} onChange={e => setInfoForm({ ...infoForm, mapEmbedUrl: e.target.value })}
                      placeholder="https://www.google.com/maps/embed?pb=..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                    <p className="text-xs text-gray-400 mt-1">Google Maps → Share → Embed a map → copy the src URL only</p>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={savingInfo}
                      className="bg-[#1B2A4A] text-white px-6 py-2 rounded-lg hover:bg-[#243660] transition disabled:opacity-50">
                      {savingInfo ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" onClick={() => setEditingInfo(false)}
                      className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow p-6 space-y-4">
                {[
                  { label: 'School Name', value: schoolInfo.schoolName },
                  { label: 'Subdomain', value: schoolInfo.subdomain },
                  { label: 'Address', value: schoolInfo.address },
                  { label: 'Phone', value: schoolInfo.phone },
                  { label: 'Email', value: schoolInfo.email },
                  { label: 'Established Year', value: schoolInfo.establishedYear },
                ].map(({ label, value }) => (
                  <div key={label} className="border-b border-gray-100 pb-3">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
                    <p className="text-gray-800 mt-1">{value || 'Not set'}</p>
                  </div>
                ))}
                <div className="flex gap-4">
                  {schoolInfo.logoUrl && (
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Logo</p>
                      <img src={schoolInfo.logoUrl} alt="Logo" className="h-16 object-contain rounded border border-gray-200 p-1" />
                    </div>
                  )}
                  {schoolInfo.bannerUrl && (
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Banner</p>
                      <img src={schoolInfo.bannerUrl} alt="Banner" className="h-16 w-full object-cover rounded border border-gray-200" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">About</p>
                  <div className="text-gray-800 mt-1 prose prose-sm max-w-none" data-color-mode="light">
                    <MDEditor.Markdown source={schoolInfo.aboutText || 'Not set'} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
