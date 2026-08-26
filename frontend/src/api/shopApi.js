import api from './axiosInstance';

export const getShopsApi = (params) => api.get('/shops', { params });
export const getFeaturedShopsApi = () => api.get('/shops/featured');
export const getShopByIdApi = (id) => api.get(`/shops/${id}`);
export const getMyShopApi = () => api.get('/shops/my');
export const createShopApi = (data) => api.post('/shops', data);
export const updateShopApi = (id, data) => api.put(`/shops/${id}`, data);
export const uploadShopImagesApi = (id, formData) =>
  api.post(`/shops/${id}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const blockDateApi = (id, data) => api.post(`/shops/${id}/block-date`, data);
export const unblockDateApi = (id, date) => api.delete(`/shops/${id}/block-date/${date}`);
