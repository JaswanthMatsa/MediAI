import API from './api';

export const chatService = {
  sendMessage: async (message, location = null) => {
    const response = await API.post('/chat/message', { message, location });
    return response.data;
  },
  getHistory: async () => {
    const response = await API.get('/chat/history');
    return response.data;
  },
  clearHistory: async () => {
    const response = await API.delete('/chat/history');
    return response.data;
  }
};
