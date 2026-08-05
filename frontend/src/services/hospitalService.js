import API from './api';

export const hospitalService = {
  getNearby: async (lat, lng, radius = 5000, type = 'all') => {
    const response = await API.get(`/hospitals/nearby?lat=${lat}&lng=${lng}&radius=${radius}&type=${type}`);
    return response.data;
  },
  saveHospital: async (hospitalData) => {
    const response = await API.post('/hospitals/save', hospitalData);
    return response.data;
  }
};
