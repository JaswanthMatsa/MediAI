import API from './api';

export const authService = {
  register: async (userData) => {
    const response = await API.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  },
  getMe: async () => {
    const response = await API.get('/auth/me');
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await API.put('/auth/profile', profileData);
    return response.data;
  }
};
