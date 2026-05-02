import { useState, useEffect } from 'react';
import { getCalendarEvents, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '../../services/api';

const CalendarManager = ({ tenantId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    eventType: 'General'
  });

  useEffect(() => {
    if (tenantId) fetchEvents();
  }, [tenantId]);

  const fetchEvents = async () => {
    try {
      const data = await getCalendarEvents(tenantId);
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await updateCalendarEvent(editingEvent.id, { ...formData, tenantId: parseInt(tenantId) });
      } else {
        await createCalendarEvent({ ...formData, tenantId: parseInt(tenantId) });
      }
      setShowModal(false);
      setEditingEvent(null);
      setFormData({ title: '', description: '', eventDate: '', eventType: 'General' });
      fetchEvents();
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      eventDate: event.eventDate.split('T')[0],
      eventType: event.eventType || 'General'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this event?')) {
      await deleteCalendarEvent(id);
      fetchEvents();
    }
  };

  const openAddModal = () => {
    setEditingEvent(null);
    setFormData({ title: '', description: '', eventDate: '', eventType: 'General' });
    setShowModal(true);
  };

  const eventTypeColors = {
    Holiday: 'bg-red-500', Exam: 'bg-yellow-500', Meeting: 'bg-blue-500',
    Event: 'bg-green-500', General: 'bg-purple-500'
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Calendar Events</h2>
        <button onClick={openAddModal} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Event</button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {events.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No events</td></tr>
            ) : (
              events.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate)).map(event => (
                <tr key={event.id}>
                  <td className="px-6 py-4">{event.title}</td>
                  <td className="px-6 py-4">{new Date(event.eventDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`${eventTypeColors[event.eventType] || 'bg-gray-500'} text-white text-xs px-2 py-1 rounded`}>{event.eventType}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleEdit(event)} className="text-blue-600 hover:underline mr-3">Edit</button>
                    <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingEvent ? 'Edit Event' : 'Add Event'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full border rounded p-2" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="date" value={formData.eventDate} onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })} className="w-full border rounded p-2" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Type</label>
                <select value={formData.eventType} onChange={(e) => setFormData({ ...formData, eventType: e.target.value })} className="w-full border rounded p-2">
                  <option value="General">General</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Exam">Exam</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Event">Event</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full border rounded p-2" rows="3" />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{editingEvent ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarManager;
