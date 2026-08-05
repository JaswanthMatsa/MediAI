import API from './api';

export const medicineService = {
  search: async (query = '') => {
    const response = await API.get(`/medicines/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
  getBySymptom: async (symptom) => {
    const response = await API.get(`/medicines/symptom/${encodeURIComponent(symptom)}`);
    return response.data;
  },
  saveMedicine: async (medicineData) => {
    const response = await API.post('/medicines/save', medicineData);
    return response.data;
  }
};
