const API_BASE_URL = 'http://localhost:5000/api/v1';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Complaint methods
  async createComplaint(complaintData) {
    return this.request('/complaints', {
      method: 'POST',
      body: JSON.stringify(complaintData),
    });
  }

  async getComplaints(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/complaints?${params}`);
  }

  async updateComplaintStatus(complaintId, status) {
    return this.request(`/complaints/${complaintId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getCategories() {
    return this.request('/categories');
  }

  async getPriorities() {
    return this.request('/priorities');
  }

  async deleteComplaint(complaintId) {
    return this.request(`/complaints/${complaintId}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();