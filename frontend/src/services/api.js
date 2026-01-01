/**
 * HI AI-APP.COM - API Service
 * Centralized API calls for backend integration
 */

import axios from 'axios';

const API_BASE = process.env.REACT_APP_BACKEND_URL;
export const API = `${API_BASE}/api`;

// Create axios instance with defaults
const apiClient = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// PROFILE APIs
// ============================================

export const profileAPI = {
  // Create a new profile
  create: async (profileData) => {
    const response = await apiClient.post('/profiles', profileData);
    return response.data;
  },

  // Get profile by ID
  getById: async (profileId) => {
    const response = await apiClient.get(`/profiles/${profileId}`);
    return response.data;
  },

  // Get profile by user ID
  getByUserId: async (userId) => {
    const response = await apiClient.get(`/profiles/user/${userId}`);
    return response.data;
  },

  // Update profile
  update: async (profileId, updates) => {
    const response = await apiClient.put(`/profiles/${profileId}`, updates);
    return response.data;
  },

  // List all profiles with filters
  list: async (params = {}) => {
    const response = await apiClient.get('/profiles', { params });
    return response.data;
  },

  // Get profile analytics
  analytics: async () => {
    const response = await apiClient.get('/db/profiles/analytics');
    return response.data;
  },
};

// ============================================
// FAMILY APIs
// ============================================

export const familyAPI = {
  // Create a new family
  create: async (familyData) => {
    const response = await apiClient.post('/families', familyData);
    return response.data;
  },

  // Get family by ID
  getById: async (familyId) => {
    const response = await apiClient.get(`/families/${familyId}`);
    return response.data;
  },

  // Get family by user ID (member)
  getByUserId: async (userId) => {
    const response = await apiClient.get(`/families/user/${userId}`);
    return response.data;
  },

  // Update family
  update: async (familyId, updates) => {
    const response = await apiClient.put(`/families/${familyId}`, updates);
    return response.data;
  },

  // Add family member
  addMember: async (familyId, memberData) => {
    const response = await apiClient.post(`/families/${familyId}/members`, memberData);
    return response.data;
  },

  // List all families
  list: async (params = {}) => {
    const response = await apiClient.get('/db/families', { params });
    return response.data;
  },
};

// ============================================
// USER APIs
// ============================================

export const userAPI = {
  // Create user
  create: async (userData) => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  // Get user by ID
  getById: async (userId) => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  // Get user detail (with profile and wallet)
  getDetail: async (userId) => {
    const response = await apiClient.get(`/db/users/${userId}`);
    return response.data;
  },

  // List users
  list: async (params = {}) => {
    const response = await apiClient.get('/db/users', { params });
    return response.data;
  },
};

// ============================================
// AUTH APIs
// ============================================

export const authAPI = {
  // Send OTP
  sendOTP: async (phone) => {
    const response = await apiClient.post('/auth/send-otp', { phone });
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (phone, otp) => {
    const response = await apiClient.post('/auth/verify-otp', { phone, otp });
    return response.data;
  },
};

// ============================================
// JOBS APIs
// ============================================

export const jobsAPI = {
  // Create job
  create: async (jobData) => {
    const response = await apiClient.post('/jobs', jobData);
    return response.data;
  },

  // Get job by ID
  getById: async (jobId) => {
    const response = await apiClient.get(`/jobs/${jobId}`);
    return response.data;
  },

  // List jobs with filters
  list: async (params = {}) => {
    const response = await apiClient.get('/jobs', { params });
    return response.data;
  },

  // Apply to job
  apply: async (jobId, doerId) => {
    const response = await apiClient.post(`/applications`, null, {
      params: { job_id: jobId, doer_id: doerId }
    });
    return response.data;
  },

  // Get job analytics
  analytics: async () => {
    const response = await apiClient.get('/db/jobs/analytics');
    return response.data;
  },
};

// ============================================
// D-COIN APIs
// ============================================

export const dcoinAPI = {
  // Get wallet
  getWallet: async (userId) => {
    const response = await apiClient.get(`/wallets/${userId}`);
    return response.data;
  },

  // Get transactions
  getTransactions: async (userId, params = {}) => {
    const response = await apiClient.get(`/wallets/${userId}/transactions`, { params });
    return response.data;
  },

  // Get economy stats
  stats: async () => {
    const response = await apiClient.get('/db/dcoin/stats');
    return response.data;
  },
};

// ============================================
// DATABASE MANAGEMENT APIs (CTO Dashboard)
// ============================================

export const dbAPI = {
  // Get database stats
  stats: async () => {
    const response = await apiClient.get('/db/stats');
    return response.data;
  },

  // Health check
  health: async () => {
    const response = await apiClient.get('/db/health');
    return response.data;
  },

  // Seed database with test data
  seed: async (count = 10) => {
    const response = await apiClient.post('/db/seed', null, {
      params: { count }
    });
    return response.data;
  },

  // Clear test data
  clear: async (confirm = 'YES_DELETE_ALL') => {
    const response = await apiClient.delete('/db/clear', {
      params: { confirm }
    });
    return response.data;
  },
};

// ============================================
// AI CHAT API (Agent AIMEE)
// ============================================

export const aiAPI = {
  // Chat with Agent AIMEE
  chat: async (message, userId, sessionId = null) => {
    const response = await apiClient.post('/chat', {
      message,
      user_id: userId,
      session_id: sessionId
    });
    return response.data;
  },
};

export default {
  profile: profileAPI,
  family: familyAPI,
  user: userAPI,
  auth: authAPI,
  jobs: jobsAPI,
  dcoin: dcoinAPI,
  db: dbAPI,
  ai: aiAPI,
};
