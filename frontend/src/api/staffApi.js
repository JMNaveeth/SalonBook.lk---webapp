import api from './axiosInstance';

export const getStaffByShopApi = (shopId) => api.get(`/staff/shop/${shopId}`);
export const addStaffApi = (formData) =>
  api.post('/staff', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateStaffApi = (id, formData) =>
  api.put(`/staff/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteStaffApi = (id) => api.delete(`/staff/${id}`);
