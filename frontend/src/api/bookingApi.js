import api from './axiosInstance';

export const createBookingApi = (data) => api.post('/bookings', data);
export const getMyBookingsApi = () => api.get('/bookings/my');
export const getShopBookingsApi = (shopId) => api.get(`/bookings/shop/${shopId}`);

export const acceptBookingApi = (id, data) => api.patch(`/bookings/${id}/accept`, data);
export const rejectBookingApi = (id, data) => api.patch(`/bookings/${id}/reject`, data);
export const rescheduleBookingApi = (id, data) => api.patch(`/bookings/${id}/reschedule`, data);
export const confirmRescheduleApi = (id) => api.patch(`/bookings/${id}/confirm-reschedule`);
export const declineRescheduleApi = (id) => api.patch(`/bookings/${id}/decline-reschedule`);
export const reassignStaffApi = (id, data) => api.patch(`/bookings/${id}/reassign-staff`, data);
export const completeBookingApi = (id) => api.patch(`/bookings/${id}/complete`);
export const noShowBookingApi = (id) => api.patch(`/bookings/${id}/no-show`);
