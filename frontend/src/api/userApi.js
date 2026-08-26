import api from './axiosInstance';

export const getProfileApi = () => api.get('/users/profile');
export const updateProfileApi = (formData) =>
  api.put('/users/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const getFavouritesApi = () => api.get('/users/favourites');
export const addFavouriteApi = (shopId) => api.post(`/users/favourites/${shopId}`);
export const removeFavouriteApi = (shopId) => api.delete(`/users/favourites/${shopId}`);

export const getNotificationsApi = () => api.get('/users/notifications');
export const markNotificationReadApi = (id) => api.patch(`/users/notifications/${id}/read`);
