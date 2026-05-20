import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5071/api';

const TYPE_COLORS = {
  Holiday: { bg: '#FEE2E2', text: '#DC2626', border: '#FECACA' },
  Exam: { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
  Meeting: { bg: '#DBEAFE', text: '#2563EB', border: '#BFDBFE' },
  Event: { bg: '#D1FAE5', text: '#059669', border: '#A7F3D0' },
  General: { bg: '#EDE9FE', text: '#7C3AED', border: '#DDD6FE' },
};

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const CalendarManager = ({ tenantId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', eventDate: '', eventEndDate: '', eventType: 'General', location: '' });
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => { if (tenantId) fetchEvents(); }, [tenantId]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/CalendarEvent/tenant/${tenantId}`);
      if (res.ok) { setEvents(await res.json()); setMsg(''); }
      else setMsg('❌ Failed to load events (status ' + res.status + ')');
    } catch (e) { setMsg('❌ Network error: ' + e.message); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editingEvent ? `${API}/CalendarEvent/${editingEvent.id}` : `${API}/CalendarEvent`;
      const method = editingEvent ? 'PUT' : 'POST';
      const body = {
        ...form,
        tenantId: parseInt(tenantId),
        eventDate: form.eventDate + 'T00:00:00',
        eventEndDate: form.eventEndDate ? form.eventEndDate + 'T00:00:00' : null
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
        const txt = await res.text();
        setMsg('❌ Error ' + res.status + ': ' + txt);
      }
    } catch (e) { setMsg('❌ ' + e.message); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return;
    try {
      await fetch(`${API}/CalendarEvent/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchEvents();
    } catch (e) { alert('Error: ' + e.message); }
  };

  const handleEdit = (ev) => {
    setEditingEvent(ev);
    setForm({
      title: ev.title, description: ev.description || '',
      eventDate: ev.eventDate.split('T')[0],
      eventEndDate: ev.eventEndDate ? ev.eventEndDate.split('T')[0] : '',
      eventType: ev.eventType || 'General', location: ev.location || ''
    });
    setShowForm(true);
    setSelectedDay(null);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const getEventsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.eventDate?.startsWith(dateStr));
  };

  const upcomingEvents = events
    .filter(e => new Date(e.eventDate) >= new Date())
    .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
    .slice(0, 6);

  const selectedEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-[#1B2A4A]"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1B2A4A]">📅 Calendar Events</h1>
        <button onClick={() => { setShowForm(!showForm); setEditingEvent(null); setForm({ title: '', description: '', eventDate: '', eventEndDate: '', eventType: 'General', location: '' }); }}
          className="bg-[#1B2A4A] text-white px-4 py-2 rounded-lg hover:bg-[#243660] transition text-sm font-medium">
          {showForm ? 'Cancel' : '+ Add Event'}
        </button>
      </div>

      {msg && (
        <div className={`px-4 py-3 rounded-lg text-sm font-medium ${msg.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {msg}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-bold text-[#1B2A4A] mb-4">{editingEvent ? 'Edit Event' : 'New Event'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Start Date *</label>
              <input type="date" value={form.eventDate} onChange={e => setForm({...form, eventDate: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">End Date <span className="text-gray-400">(optional)</span></label>
              <input type="date" value={form.eventEndDate} min={form.eventDate} onChange={e => setForm({...form, eventEndDate: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Event Type</label>
              <select value={form.eventType} onChange={e => setForm({...form, eventType: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]">
                {Object.keys(TYPE_COLORS).map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
              <input value={form.location} onChange={e => setForm({...form, location: e.target.value})}
                placeholder="e.g. Main Hall"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
            </div>
            <div className="col-span-2 flex gap-3">
              <button type="submit" disabled={submitting}
                className="bg-[#1B2A4A] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#243660] transition disabled:opacity-50">
                {submitting ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingEvent(null); }}
                className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition text-gray-500">
              ‹
            </button>
            <h3 className="font-bold text-gray-800">{MONTHS[month]} {year}</h3>
            <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition text-gray-500">
              ›
            </button>
          </div>
          <div className="grid grid-cols-7 border-b border-gray-100">
            {DAYS.map(d => (
              <div key={d} className="py-2 text-center text-xs font-semibold text-gray-400 uppercase">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`e${i}`} className="min-h-[70px] border-b border-r border-gray-50 bg-gray-50/50" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDay(day);
              const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
              const isSelected = selectedDay === day;
              return (
                <div key={day} onClick={() => setSelectedDay(isSelected ? null : day)}
                  className={`min-h-[70px] border-b border-r border-gray-50 p-1.5 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                  <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium mb-1 ${isToday ? 'bg-[#1B2A4A] text-white' : 'text-gray-700'}`}>
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 2).map(ev => {
                      const c = TYPE_COLORS[ev.eventType] || TYPE_COLORS.General;
                      return (
                        <div key={ev.id} className="text-xs px-1 py-0.5 rounded truncate font-medium"
                          style={{ backgroundColor: c.bg, color: c.text }}>
                          {ev.title}
                        </div>
                      );
                    })}
                    {dayEvents.length > 2 && <div className="text-xs text-gray-400 px-1">+{dayEvents.length - 2}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {selectedDay && selectedEvents.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h4 className="font-bold text-gray-800 mb-3 text-sm">{MONTHS[month]} {selectedDay}</h4>
              <div className="space-y-2">
                {selectedEvents.map(ev => {
                  const c = TYPE_COLORS[ev.eventType] || TYPE_COLORS.General;
                  return (
                    <div key={ev.id} className="rounded-lg p-3 border" style={{ backgroundColor: c.bg, borderColor: c.border }}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-sm" style={{ color: c.text }}>{ev.title}</p>
                          {ev.location && <p className="text-xs text-gray-500 mt-0.5">📍 {ev.location}</p>}
                          {ev.description && <p className="text-xs text-gray-600 mt-1">{ev.description}</p>}
                        </div>
                        <div className="flex gap-1 ml-2">
                          <button onClick={() => handleEdit(ev)} className="text-xs text-blue-500 hover:text-blue-700">Edit</button>
                          <button onClick={() => handleDelete(ev.id)} className="text-xs text-red-400 hover:text-red-600 ml-1">Del</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h4 className="font-bold text-gray-800 mb-3 text-sm">Upcoming Events</h4>
            {upcomingEvents.length === 0 ? (
              <p className="text-gray-400 text-xs">No upcoming events</p>
            ) : (
              <div className="space-y-2">
                {upcomingEvents.map(ev => {
                  const c = TYPE_COLORS[ev.eventType] || TYPE_COLORS.General;
                  const d = new Date(ev.eventDate);
                  return (
                    <div key={ev.id} className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-lg flex-shrink-0 flex flex-col items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: c.text }}>
                        <span>{d.getDate()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{ev.title}</p>
                        <p className="text-xs text-gray-400">{MONTHS[d.getMonth()].slice(0,3)} {d.getFullYear()}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(ev)} className="text-xs text-blue-400 hover:text-blue-600">Edit</button>
                        <button onClick={() => handleDelete(ev.id)} className="text-xs text-red-400 hover:text-red-600">Del</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h4 className="font-bold text-gray-800 mb-3 text-sm">Legend</h4>
            <div className="space-y-1.5">
              {Object.entries(TYPE_COLORS).map(([type, c]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.text }}></div>
                  <span className="text-xs text-gray-600">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarManager;
