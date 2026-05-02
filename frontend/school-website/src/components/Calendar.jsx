import { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';

const eventTypeColors = {
  Holiday: { bg: 'bg-red-500', light: 'bg-red-50 text-red-700 border-red-200' },
  Exam: { bg: 'bg-amber-500', light: 'bg-amber-50 text-amber-700 border-amber-200' },
  Meeting: { bg: 'bg-blue-500', light: 'bg-blue-50 text-blue-700 border-blue-200' },
  Event: { bg: 'bg-green-500', light: 'bg-green-50 text-green-700 border-green-200' },
  General: { bg: 'bg-purple-500', light: 'bg-purple-50 text-purple-700 border-purple-200' },
};

const Calendar = () => {
  const { tenant } = useTenant();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    if (tenant?.subdomain) fetchEvents();
    else setLoading(false);
  }, [tenant]);

  const fetchEvents = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5071/api';
      const res = await fetch(`${apiUrl}/school/${tenant.subdomain}/calendar`);
      if (res.ok) setEvents(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const getEventsForDay = (day) => {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return events.filter(e => e.eventDate?.startsWith(dateStr));
  };

  const upcomingEvents = events
    .filter(e => new Date(e.eventDate) >= new Date())
    .sort((a,b) => new Date(a.eventDate) - new Date(b.eventDate))
    .slice(0, 5);

  const selectedEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  if (loading) return (
    <section id="calendar" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-blue-500 mx-auto"></div>
      </div>
    </section>
  );

  return (
    <section id="calendar" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: tenant?.accentColor || '#C9A84C' }}>
            SCHEDULE & EVENTS
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">School Calendar</h2>
          <div className="w-20 h-1 mx-auto rounded-full" style={{ backgroundColor: tenant?.accentColor || '#C9A84C' }}></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

              {/* Month Navigation */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <button onClick={() => setCurrentDate(new Date(year, month-1, 1))}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
                <h3 className="text-lg font-bold text-gray-900">{monthNames[month]} {year}</h3>
                <button onClick={() => setCurrentDate(new Date(year, month+1, 1))}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-gray-100">
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                  <div key={d} className="py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">{d}</div>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7">
                {Array.from({length: firstDay}).map((_,i) => (
                  <div key={`e${i}`} className="min-h-[80px] border-b border-r border-gray-50"></div>
                ))}
                {Array.from({length: daysInMonth}).map((_,i) => {
                  const day = i+1;
                  const dayEvents = getEventsForDay(day);
                  const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
                  const isSelected = selectedDay === day;
                  return (
                    <div key={day} onClick={() => setSelectedDay(isSelected ? null : day)}
                      className={`min-h-[80px] border-b border-r border-gray-50 p-2 cursor-pointer transition-colors
                        ${isToday ? 'bg-blue-50' : 'hover:bg-gray-50'}
                        ${isSelected ? 'ring-2 ring-inset' : ''}`}
                      style={isSelected ? { ringColor: tenant?.primaryColor } : {}}>
                      <div className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1
                        ${isToday ? 'text-white' : 'text-gray-700'}`}
                        style={isToday ? { backgroundColor: tenant?.primaryColor || '#1B2A4A' } : {}}>
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0,2).map(ev => (
                          <div key={ev.id}
                            className={`text-xs px-1.5 py-0.5 rounded-full truncate font-medium text-white ${eventTypeColors[ev.eventType]?.bg || 'bg-gray-500'}`}>
                            {ev.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-400 pl-1">+{dayEvents.length-2} more</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected day events */}
            {selectedDay && selectedEvents.length > 0 && (
              <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h4 className="font-bold text-gray-800 mb-3">{monthNames[month]} {selectedDay}, {year}</h4>
                <div className="space-y-2">
                  {selectedEvents.map(ev => (
                    <div key={ev.id} className={`flex items-start gap-3 p-3 rounded-xl border ${eventTypeColors[ev.eventType]?.light || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{ev.title}</p>
                        {ev.description && <p className="text-xs mt-0.5 opacity-75">{ev.description}</p>}
                        {ev.location && <p className="text-xs mt-0.5 opacity-75">📍 {ev.location}</p>}
                      </div>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-60">{ev.eventType}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Upcoming Events Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Events</h3>
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm">No upcoming events</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map(ev => (
                    <div key={ev.id} className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer">
                      <div className={`w-2 rounded-full flex-shrink-0 ${eventTypeColors[ev.eventType]?.bg || 'bg-gray-400'}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-800 truncate">{ev.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(ev.eventDate).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                        </p>
                        {ev.description && <p className="text-xs text-gray-500 mt-0.5 truncate">{ev.description}</p>}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full border flex-shrink-0 ${eventTypeColors[ev.eventType]?.light || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {ev.eventType}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h4 className="text-sm font-bold text-gray-700 mb-3">Event Types</h4>
              <div className="space-y-2">
                {Object.entries(eventTypeColors).map(([type, colors]) => (
                  <div key={type} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${colors.bg}`}></div>
                    <span className="text-sm text-gray-600">{type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calendar;
