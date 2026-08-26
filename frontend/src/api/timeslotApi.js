import api from './axiosInstance';

export const getAvailableSlotsApi = (shopId, date, staffId) =>
  api.get(`/slots/shop/${shopId}`, { params: { date, staffId } });
export const generateSlotsApi = (data) => api.post('/slots/generate', data);
