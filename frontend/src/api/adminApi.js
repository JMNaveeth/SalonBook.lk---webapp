import api from './axiosInstance';

export const getAdminDashboardApi = () => api.get('/admin/dashboard');
export const getAllAdminShopsApi = (status) => api.get('/admin/shops', { params: { status } });
export const approveShopApi = (id) => api.patch(`/admin/shops/${id}/approve`);
export const rejectShopApi = (id, data) => api.patch(`/admin/shops/${id}/reject`, data);
export const suspendShopApi = (id) => api.patch(`/admin/shops/${id}/suspend`);
export const toggleFeaturedShopApi = (id, data) => api.patch(`/admin/shops/${id}/feature`, data);

export const getAllUsersApi = () => api.get('/admin/users');
export const toggleUserBanApi = (id, data) => api.patch(`/admin/users/${id}/ban`, data);

export const getAllPaymentsAdminApi = () => api.get('/admin/payments');
export const getAdminAnalyticsApi = () => api.get('/admin/analytics');
