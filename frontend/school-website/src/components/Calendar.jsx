import { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';

const Calendar = () => {
  const { tenant } = useTenant();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (tenant?.id) {
      fetchEvents();
    }
  }, [tenant]);

  const fetchEvents = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5071/api';
      const response = await fetch(`${apiUrl}/CalendarEvent/tenant/${tenant.id}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { daysInMonth: lastDay.getDate(), startingDay: firstDay.getDay() };
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const getEventsForDay = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.eventDate && e.eventDate.startsWith(dateStr));
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const eventTypeColors = {
    Holiday: 'bg-red-500',
    Exam: 'bg-yellow-500',
    Meeting: 'bg-blue-500',
    Event: 'bg-green-500',
    General: 'bg-purple-500'
  };

  const upcomingEvents = events
    .filter(e => new Date(e.eventDate) >= new Date())
    .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
    .slice(0, 5);

  if (loading) {
    return (
      <section id="calendar" className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="calendar" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">School Calendar</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Grid */}
          <div className="lg:col-span-2 bg-gray-50 rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <button onClick={prevMonth} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">&lt;</button>
              <h3 className="text-xl font-semibold">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
              <button onClick={nextMonth} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">&gt;</button>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center font-semibold text-sm bg-gray-200 rounded">{day}</div>
              ))}
              {Array.from({ length: startingDay }).map((_, i) => (
                <div key={`empty-${i}`} className="p-2 min-h-16"></div>
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayEvents = getEventsForDay(day);
                const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
                return (
                  <div key={day} className={`p-1 min-h-16 border rounded ${isToday ? 'bg-blue-100 border-blue-500' : 'bg-white'}`}>
                    <div className="text-sm font-medium">{day}</div>
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className={`${eventTypeColors[event.eventType] || 'bg-gray-500'} text-white text-xs p-0.5 rounded mt-0.5 truncate`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-gray-50 rounded-lg shadow p-4">
            <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
            {upcomingEvents.length === 0 ? (
              <p className="text-gray-500">No upcoming events</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="bg-white p-3 rounded shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`${eventTypeColors[event.eventType] || 'bg-gray-500'} text-white text-xs px-2 py-0.5 rounded`}>
                        {event.eventType}
                      </span>
                    </div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-600">{new Date(event.eventDate).toLocaleDateString()}</p>
                    {event.description && <p className="text-sm text-gray-500 mt-1">{event.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calendar;
