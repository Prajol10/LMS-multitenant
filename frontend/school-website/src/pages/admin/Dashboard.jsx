import { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { useNavigate, useParams } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5071/api';

export default function Dashboard() {
  const { school } = useParams();
  const storedSchool = localStorage.getItem('school') || school;
  const [activeTab, setActiveTab] = useState('notices');
  const [notices, setNotices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [schoolInfo, setSchoolInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', isImportant: false });
  const [galleryForm, setGalleryForm] = useState({ imageUrl: '', caption: '' });
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [message, setMessage] = useState('');
  const [editingInfo, setEditingInfo] = useState(false);
  const [infoForm, setInfoForm] = useState({});
  const [savingInfo, setSavingInfo] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API}/admin/school`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const s = await res.json();
      setSchoolInfo(s);
      setInfoForm({
        schoolName: s.schoolName || '',
        aboutText: s.aboutText || '',
        address: s.address || '',
        phone: s.phone || '',
        email: s.email || '',
        establishedYear: s.establishedYear || '',
        logoUrl: s.logoUrl || '',
        facebookUrl: s.facebookUrl || '',
        instagramUrl: s.instagramUrl || '',
        websiteUrl: s.websiteUrl || '',
        mapEmbedUrl: s.mapEmbedUrl || '',
        videoUrl: s.videoUrl || '',
        aboutImageUrl: s.aboutImageUrl || '',
      });

      const noticesRes = await fetch(`${API}/school/${s.subdomain}/notices`);
      setNotices(await noticesRes.json());

      const galleryRes = await fetch(`${API}/school/${s.subdomain}/gallery`);
      setGallery(await galleryRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addNotice = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/notice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(noticeForm)
      });
      if (!res.ok) throw new Error('Failed to add notice');
      setMessage('Notice added!');
      setShowNoticeForm(false);
      setNoticeForm({ title: '', content: '', isImportant: false });
      fetchData();
    } catch (err) { setMessage(err.message); }
  };

  const deleteNotice = async (id) => {
    if (!confirm('Delete this notice?')) return;
    try {
      await fetch(`${API}/notice/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const addGalleryImage = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(galleryForm)
      });
      if (!res.ok) throw new Error('Failed to add image');
      setMessage('Image added!');
      setShowGalleryForm(false);
      setGalleryForm({ imageUrl: '', caption: '' });
      fetchData();
    } catch (err) { setMessage(err.message); }
  };

  const deleteGalleryImage = async (id) => {
    if (!confirm('Delete this image?')) return;
    try {
      await fetch(`${API}/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const saveSchoolInfo = async (e) => {
    e.preventDefault();
    setSavingInfo(true);
    try {
      const res = await fetch(`${API}/admin/school`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...infoForm,
          establishedYear: infoForm.establishedYear ? parseInt(infoForm.establishedYear) : null
        })
      });
      if (!res.ok) throw new Error('Failed to save');
      setMessage('School info saved!');
      setEditingInfo(false);
      fetchData();
    } catch (err) { setMessage(err.message); }
    finally { setSavingInfo(false); }
  };

  const logout = () => {
    localStorage.clear();
    navigate(`/${storedSchool}/admin`);
  };

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
        <nav className="flex-1 p-4 space-y-2">
          {['notices', 'gallery', 'info'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition capitalize ${activeTab === tab ? 'bg-[#243660]' : 'hover:bg-[#243660]/50'}`}>
              {tab === 'info' ? 'School Info' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
        <div className="p-4 space-y-2">
          <a href={`/${school}`}
            className="block w-full text-center bg-[#243660] hover:bg-[#2d4580] text-white px-4 py-2 rounded-lg text-sm transition">
            View Public Site
          </a>
          <button onClick={logout} className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition">
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 p-8">
        {message && (
          <div className="mb-4 px-4 py-3 bg-green-50 text-green-600 rounded-lg text-sm flex justify-between">
            {message}
            <button onClick={() => setMessage('')}>✕</button>
          </div>
        )}

        {activeTab === 'notices' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-[#1B2A4A]">Notices</h1>
              <button onClick={() => setShowNoticeForm(!showNoticeForm)}
                className="bg-[#1B2A4A] text-white px-4 py-2 rounded-lg hover:bg-[#243660] transition">
                {showNoticeForm ? 'Cancel' : '+ Add Notice'}
              </button>
            </div>
            {showNoticeForm && (
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <form onSubmit={addNotice} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input value={noticeForm.title} onChange={e => setNoticeForm({...noticeForm, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea value={noticeForm.content} onChange={e => setNoticeForm({...noticeForm, content: e.target.value})}
                      rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" required />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={noticeForm.isImportant}
                      onChange={e => setNoticeForm({...noticeForm, isImportant: e.target.checked})} className="w-4 h-4" />
                    <span className="text-sm font-medium text-gray-700">Mark as Important</span>
                  </label>
                  <button type="submit" className="bg-[#1B2A4A] text-white px-6 py-2 rounded-lg hover:bg-[#243660] transition">
                    Add Notice
                  </button>
                </form>
              </div>
            )}
            <div className="space-y-4">
              {notices.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">No notices yet — add your first notice!</div>
              ) : notices.map(notice => (
                <div key={notice.id} className={`bg-white rounded-xl shadow p-5 border-l-4 ${notice.isImportant ? 'border-red-500' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-800">{notice.title}</h3>
                        {notice.isImportant && <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-medium">Important</span>}
                      </div>
                      <p className="text-gray-600 text-sm">{notice.content}</p>
                      <p className="text-gray-400 text-xs mt-2">{new Date(notice.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => deleteNotice(notice.id)} className="text-red-400 hover:text-red-600 transition ml-4 text-sm">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-[#1B2A4A]">Gallery</h1>
              <button onClick={() => setShowGalleryForm(!showGalleryForm)}
                className="bg-[#1B2A4A] text-white px-4 py-2 rounded-lg hover:bg-[#243660] transition">
                {showGalleryForm ? 'Cancel' : '+ Add Image'}
              </button>
            </div>
            {showGalleryForm && (
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <form onSubmit={addGalleryImage} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                    <div className="flex gap-3 mb-3">
                      <button type="button"
                        onClick={() => setGalleryForm({...galleryForm, uploadMode: 'url'})}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${!galleryForm.uploadMode || galleryForm.uploadMode === 'url' ? 'bg-[#1B2A4A] text-white' : 'bg-gray-100 text-gray-700'}`}>
                        Paste URL
                      </button>
                      <button type="button"
                        onClick={() => setGalleryForm({...galleryForm, uploadMode: 'file'})}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${galleryForm.uploadMode === 'file' ? 'bg-[#1B2A4A] text-white' : 'bg-gray-100 text-gray-700'}`}>
                        Upload from Device
                      </button>
                    </div>
                    {(!galleryForm.uploadMode || galleryForm.uploadMode === 'url') ? (
                      <input value={galleryForm.imageUrl} onChange={e => setGalleryForm({...galleryForm, imageUrl: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
                        placeholder="https://images.unsplash.com/..." />
                    ) : (
                      <div>
                        <input type="file" accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setGalleryForm({...galleryForm, imageUrl: reader.result, uploadMode: 'file'});
                            };
                            reader.readAsDataURL(file);
                          }}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                        {galleryForm.imageUrl && galleryForm.uploadMode === 'file' && (
                          <img src={galleryForm.imageUrl} alt="Preview" className="mt-2 h-32 object-cover rounded-lg" />
                        )}
                        <p className="text-xs text-gray-400 mt-1">Note: Image will be stored as base64. For best performance use URL option.</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                    <input value={galleryForm.caption} onChange={e => setGalleryForm({...galleryForm, caption: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                  </div>
                  <button type="submit" className="bg-[#1B2A4A] text-white px-6 py-2 rounded-lg hover:bg-[#243660] transition">
                    Add Image
                  </button>
                </form>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.length === 0 ? (
                <div className="col-span-3 bg-white rounded-xl shadow p-8 text-center text-gray-400">No images yet — add your first photo!</div>
              ) : gallery.map(img => (
                <div key={img.id} className="bg-white rounded-xl shadow overflow-hidden">
                  <img src={img.imageUrl} alt={img.caption} className="w-full h-48 object-cover" />
                  <div className="p-3 flex justify-between items-center">
                    <p className="text-sm text-gray-600 truncate">{img.caption}</p>
                    <button onClick={() => deleteGalleryImage(img.id)} className="text-red-400 hover:text-red-600 transition text-sm ml-2">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'info' && schoolInfo && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-[#1B2A4A]">School Information</h1>
              {!editingInfo && (
                <button onClick={() => setEditingInfo(true)}
                  className="bg-[#1B2A4A] text-white px-4 py-2 rounded-lg hover:bg-[#243660] transition">
                  Edit Info
                </button>
              )}
            </div>

            {editingInfo ? (
              <div className="bg-white rounded-xl shadow p-6">
                <form onSubmit={saveSchoolInfo} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                    <input value={infoForm.schoolName} onChange={e => setInfoForm({...infoForm, schoolName: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input value={infoForm.address} onChange={e => setInfoForm({...infoForm, address: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input value={infoForm.phone} onChange={e => setInfoForm({...infoForm, phone: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={infoForm.email} onChange={e => setInfoForm({...infoForm, email: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                    <input type="number" value={infoForm.establishedYear} onChange={e => setInfoForm({...infoForm, establishedYear: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                    <div data-color-mode="light">
                      <MDEditor
                        value={infoForm.aboutText}
                        onChange={val => setInfoForm({...infoForm, aboutText: val || ''})}
                        preview="edit"
                        height={200}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">School Logo</label>
                    <div className="flex gap-3 mb-3">
                      <button type="button"
                        onClick={() => setInfoForm({...infoForm, logoMode: 'url'})}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${!infoForm.logoMode || infoForm.logoMode === 'url' ? 'bg-[#1B2A4A] text-white' : 'bg-gray-100 text-gray-700'}`}>
                        Paste URL
                      </button>
                      <button type="button"
                        onClick={() => setInfoForm({...infoForm, logoMode: 'file'})}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${infoForm.logoMode === 'file' ? 'bg-[#1B2A4A] text-white' : 'bg-gray-100 text-gray-700'}`}>
                        Upload from Device
                      </button>
                    </div>
                    {(!infoForm.logoMode || infoForm.logoMode === 'url') ? (
                      <input value={infoForm.logoUrl || ''} onChange={e => setInfoForm({...infoForm, logoUrl: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
                        placeholder="https://..." />
                    ) : (
                      <div>
                        <input type="file" accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setInfoForm({...infoForm, logoUrl: reader.result, logoMode: 'file'});
                            };
                            reader.readAsDataURL(file);
                          }}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                        {infoForm.logoUrl && infoForm.logoMode === 'file' && (
                          <img src={infoForm.logoUrl} alt="Logo Preview" className="mt-2 h-20 object-contain rounded-lg border border-gray-200 p-2 bg-gray-50" />
                        )}
                      </div>
                    )}
                    <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs font-medium text-blue-700 mb-1">📐 Recommended Logo Size</p>
                      <p className="text-xs text-blue-600">Width: 200px – 400px</p>
                      <p className="text-xs text-blue-600">Height: 200px – 400px (square works best)</p>
                      <p className="text-xs text-blue-600">Format: PNG with transparent background preferred</p>
                      <p className="text-xs text-blue-600">This logo appears in the navbar of your public website</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">About Section Image</label>
                    <div className="flex gap-3 mb-3">
                      <button type="button"
                        onClick={() => setInfoForm({...infoForm, aboutImageMode: 'url'})}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${!infoForm.aboutImageMode || infoForm.aboutImageMode === 'url' ? 'bg-[#1B2A4A] text-white' : 'bg-gray-100 text-gray-700'}`}>
                        Paste URL
                      </button>
                      <button type="button"
                        onClick={() => setInfoForm({...infoForm, aboutImageMode: 'file'})}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${infoForm.aboutImageMode === 'file' ? 'bg-[#1B2A4A] text-white' : 'bg-gray-100 text-gray-700'}`}>
                        Upload from Device
                      </button>
                    </div>
                    {(!infoForm.aboutImageMode || infoForm.aboutImageMode === 'url') ? (
                      <input value={infoForm.aboutImageUrl || ''} onChange={e => setInfoForm({...infoForm, aboutImageUrl: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
                        placeholder="https://images.unsplash.com/..." />
                    ) : (
                      <div>
                        <input type="file" accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setInfoForm({...infoForm, aboutImageUrl: reader.result, aboutImageMode: 'file'});
                            };
                            reader.readAsDataURL(file);
                          }}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                        {infoForm.aboutImageUrl && infoForm.aboutImageMode === 'file' && (
                          <img src={infoForm.aboutImageUrl} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-lg" />
                        )}
                      </div>
                    )}
                    <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs font-medium text-blue-700 mb-1">📐 Recommended Image Size</p>
                      <p className="text-xs text-blue-600">Width: 800px or more</p>
                      <p className="text-xs text-blue-600">Height: 500px or more</p>
                      <p className="text-xs text-blue-600">Format: JPG or PNG</p>
                      <p className="text-xs text-blue-600">This image appears in the About section of your public website</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                    <input value={infoForm.facebookUrl} onChange={e => setInfoForm({...infoForm, facebookUrl: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
                      placeholder="https://facebook.com/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                    <input value={infoForm.instagramUrl} onChange={e => setInfoForm({...infoForm, instagramUrl: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
                      placeholder="https://instagram.com/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                    <input value={infoForm.websiteUrl} onChange={e => setInfoForm({...infoForm, websiteUrl: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
                      placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL</label>
                    <input value={infoForm.mapEmbedUrl || ''} onChange={e => setInfoForm({...infoForm, mapEmbedUrl: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
                      placeholder="https://www.google.com/maps/embed?pb=..." />
                    <p className="text-xs text-gray-400 mt-1">Go to Google Maps → Share → Embed a map → copy the src URL only</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">School Video URL (YouTube)</label>
                    <input value={infoForm.videoUrl || ''} onChange={e => setInfoForm({...infoForm, videoUrl: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
                      placeholder="https://www.youtube.com/watch?v=..." />
                    <p className="text-xs text-gray-400 mt-1">Paste a YouTube video URL to show on the homepage</p>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={savingInfo}
                      className="bg-[#1B2A4A] text-white px-6 py-2 rounded-lg hover:bg-[#243660] transition disabled:opacity-50">
                      {savingInfo ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" onClick={() => setEditingInfo(false)}
                      className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
                      Cancel
                    </button>
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
