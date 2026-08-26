import api from './axiosInstance';

export const getPaymentByBookingApi = (bookingId) => api.get(`/payments/booking/${bookingId}`);
export const initiatePayHereApi = (data) => api.post('/payments/initiate', data);
export const refundPaymentApi = (id, data) => api.post(`/payments/${id}/refund`, data);
export const getOwnerEarningsApi = () => api.get('/payments/earnings');
