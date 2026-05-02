const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5071/api';

class ApiService {
  static async getSchoolByTenant(tenantIdentifier) {
    const response = await fetch(`${API_BASE_URL}/school/${tenantIdentifier}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  static async getNoticesByTenant(tenantIdentifier) {
    const response = await fetch(`${API_BASE_URL}/school/${tenantIdentifier}/notices`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  static async getGalleryByTenant(tenantIdentifier) {
    const response = await fetch(`${API_BASE_URL}/school/${tenantIdentifier}/gallery`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  static async getProgramsByTenant(tenantIdentifier) {
    const response = await fetch(`${API_BASE_URL}/school/${tenantIdentifier}/programs`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  static async getStudentsByTenant(tenantIdentifier) {
    const response = await fetch(`${API_BASE_URL}/school/${tenantIdentifier}/students`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  static async getLeadershipByTenant(tenantIdentifier) {
    const response = await fetch(`${API_BASE_URL}/school/${tenantIdentifier}/messages`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  static async getCalendarEvents(tenantId) {
    const response = await fetch(`${API_BASE_URL}/CalendarEvent/tenant/${tenantId}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  static async createCalendarEvent(data) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/CalendarEvent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  static async updateCalendarEvent(id, data) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/CalendarEvent/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  }

  static async deleteCalendarEvent(id) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/CalendarEvent/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  }

  static async submitContact(tenantIdentifier, data) {
    const response = await fetch(`${API_BASE_URL}/school/${tenantIdentifier}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }
}

export default ApiService;

export const getCalendarEvents = (tenantId) => ApiService.getCalendarEvents(tenantId);
export const createCalendarEvent = (data) => ApiService.createCalendarEvent(data);
export const updateCalendarEvent = (id, data) => ApiService.updateCalendarEvent(id, data);
export const deleteCalendarEvent = (id) => ApiService.deleteCalendarEvent(id);
