const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5071/api';

class ApiService {
  // Get school info by subdomain or ID
  static async getSchoolByTenant(tenantIdentifier) {
    try {
      const response = await fetch(`${API_BASE_URL}/school/${tenantIdentifier}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching school:', error);
      throw error;
    }
  }

  // Get notices by subdomain or ID
  static async getNoticesByTenant(tenantIdentifier) {
    try {
      const response = await fetch(`${API_BASE_URL}/school/${tenantIdentifier}/notices`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching notices:', error);
      throw error;
    }
  }

  // Get gallery images by subdomain or ID
  static async getGalleryByTenant(tenantIdentifier) {
    try {
      const response = await fetch(`${API_BASE_URL}/school/${tenantIdentifier}/gallery`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching gallery:', error);
      throw error;
    }
  }
}

export default ApiService;
