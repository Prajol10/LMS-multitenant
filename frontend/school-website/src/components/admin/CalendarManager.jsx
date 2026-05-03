import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5071/api';

const eventTypeColors = {
  Holiday: 'bg-red-100 text-red-700',
  Exam: 'bg-amber-100 text-amber-700',
  Meeting: 'bg-blue-100 text-blue-700',
  Event: 'bg-green-100 text-green-700',
  General: 'bg-purple-100 text-purple-700',
};

const CalendarManager = ({ tenantId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', eventDate: '', eventEndDate: '',
    eventType: 'General', location: ''
  });
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => { if (tenantId) fetchEvents(); }, [tenantId]);

  const fetchEvents = async () => {
    try {
      if (!tenantId) { setLoading(false); return; }
      const res = await fetch(`${API}/CalendarEvent/tenant/${tenantId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) { setEvents(await res.json()); setMsg(""); }
      else setMsg('❌ Failed to fetch calendar events');
    } catch (e) { setMsg('❌ ' + e.message); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingEvent ? `${API}/CalendarEvent/${editingEvent.id}` : `${API}/CalendarEvent`;
      const method = editingEvent ? 'PUT' : 'POST';
      const body = {
        ...form,
        tenantId: parseInt(tenantId),
        eventEndDate: form.eventEndDate || null
      };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setMsg(editingEvent ? '✅ Event updated!' : '✅ Event created!');
        setShowForm(false); setEditingEvent(null);
        setForm({ title: '', description: '', eventDate: '', eventEndDate: '', eventType: 'General', location: '' });
        fetchEvents();
        setTimeout(() => setMsg(''), 3000);
      } else {
        const err = await res.text();
        setMsg('❌ Error: ' + err);
      }
    } catch (e) { setMsg('❌ ' + e.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return;
    await fetch(`${API}/CalendarEvent/${id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
    });
    fetchEvents();
  };

  const handleEdit = (ev) => {
    setEditingEvent(ev);
    setForm({
      title: ev.title,
      description: ev.description || '',
      eventDate: ev.eventDate.split('T')[0],
      eventEndDate: ev.eventEndDate ? ev.eventEndDate.split('T')[0] : '',
      eventType: ev.eventType || 'General',
      location: ev.location || ''
    });
    setShowForm(true);
  };

  const formatDateRange = (start, end) => {
    const s = new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    if (!end) return s;
    const e = new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${s} → ${e}`;
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B2A4A]">📅 Calendar Events</h1>
        <button onClick={() => { setShowForm(!showForm); setEditingEvent(null); setForm({ title: '', description: '', eventDate: '', eventEndDate: '', eventType: 'General', location: '' }); }}
          className="bg-[#1B2A4A] text-white px-4 py-2 rounded-lg hover:bg-[#243660] transition">
          {showForm ? 'Cancel' : '+ Add Event'}
        </button>
      </div>

      {msg && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${msg.includes('✅') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {msg}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-bold text-[#1B2A4A] mb-4">{editingEvent ? 'Edit Event' : 'New Event'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                <input type="date" value={form.eventDate} onChange={e => setForm({...form, eventDate: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date <span className="text-gray-400 text-xs">(optional)</span></label>
                <input type="date" value={form.eventEndDate} onChange={e => setForm({...form, eventEndDate: e.target.value})}
                  min={form.eventDate}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                <select value={form.eventType} onChange={e => setForm({...form, eventType: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]">
                  {['General','Holiday','Exam','Meeting','Event'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input value={form.location} onChange={e => setForm({...form, location: e.target.value})}
                  placeholder="e.g. Main Hall"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="bg-[#1B2A4A] text-white px-6 py-2 rounded-lg hover:bg-[#243660] transition">
                {editingEvent ? 'Update Event' : 'Create Event'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingEvent(null); }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {events.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No events yet — add your first event!</div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Title', 'Date Range', 'Type', 'Location', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {events.sort((a,b) => new Date(a.eventDate) - new Date(b.eventDate)).map(ev => (
                <tr key={ev.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-800">{ev.title}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{formatDateRange(ev.eventDate, ev.eventEndDate)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${eventTypeColors[ev.eventType] || 'bg-gray-100 text-gray-600'}`}>
                      {ev.eventType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{ev.location || '—'}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleEdit(ev)} className="text-blue-500 hover:text-blue-700 text-sm mr-3">Edit</button>
                    <button onClick={() => handleDelete(ev.id)} className="text-red-400 hover:text-red-600 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CalendarManager;
