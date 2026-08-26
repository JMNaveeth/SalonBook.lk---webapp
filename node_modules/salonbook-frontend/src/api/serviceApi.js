import api from './axiosInstance';

export const getServicesByShopApi = (shopId) => api.get(`/services/shop/${shopId}`);
export const addServiceApi = (data) => api.post('/services', data);
export const updateServiceApi = (id, data) => api.put(`/services/${id}`, data);
export const deleteServiceApi = (id) => api.delete(`/services/${id}`);
