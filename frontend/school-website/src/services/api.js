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
