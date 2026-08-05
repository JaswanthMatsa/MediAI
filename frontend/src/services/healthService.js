import API from './api';

export const healthService = {
  getReminders: async () => {
    const response = await API.get('/health/reminders');
    return response.data;
  },
  createReminder: async (reminderData) => {
    const response = await API.post('/health/reminders', reminderData);
    return response.data;
  },
  toggleReminder: async (id) => {
    const response = await API.put(`/health/reminders/${id}/toggle`);
    return response.data;
  },
  calculateBMI: async (weightKg, heightCm) => {
    const response = await API.post('/health/bmi', { weightKg, heightCm });
    return response.data;
  },
  getHealthInfo: async () => {
    const response = await API.get('/health/info');
    return response.data;
  }
};
