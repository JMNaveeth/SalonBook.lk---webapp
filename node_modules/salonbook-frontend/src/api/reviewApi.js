import api from './axiosInstance';

export const getShopReviewsApi = (shopId) => api.get(`/reviews/shop/${shopId}`);
export const getMyReviewsApi = () => api.get('/reviews/my');
export const submitReviewApi = (data) => api.post('/reviews', data);
export const replyReviewApi = (id, data) => api.post(`/reviews/${id}/reply`, data);
