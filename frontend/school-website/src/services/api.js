const API_BASE_URL = 'http://localhost:5071/api';

class ApiService {
  // Get school info by subdomain
  static async getSchoolBySubdomain(subdomain) {
    try {
      const response = await fetch(`${API_BASE_URL}/school/${subdomain}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching school:', error);
      throw error;
    }
  }

  // Get notices by subdomain
  static async getNoticesBySubdomain(subdomain) {
    try {
      const response = await fetch(`${API_BASE_URL}/school/${subdomain}/notices`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching notices:', error);
      throw error;
    }
  }

  // Get gallery images by subdomain
  static async getGalleryBySubdomain(subdomain) {
    try {
      const response = await fetch(`${API_BASE_URL}/school/${subdomain}/gallery`);
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
