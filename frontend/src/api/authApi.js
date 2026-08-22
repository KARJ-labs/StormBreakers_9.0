import { backend1 } from './apiClient';

export const authApi = {
  login: async (credentials) => {
    const res = await backend1.post('/auth/login', credentials);
    return res.data;
  },

  register: async (userData) => {
    const res = await backend1.post('/auth/register', userData);
    return res.data;
  },

  verify: async () => {
    const res = await backend1.get('/auth/verify');
    return res.data;
  },

  logout: async () => {
    const res = await backend1.post('/auth/logout');
    return res.data;
  },

  refreshToken: async () => {
    const res = await backend1.get('/auth/refresh-token');
    return res.data;
  },

  forgotPassword: async (data) => {
    const res = await backend1.post('/auth/forgot-password', data);
    return res.data;
  },

  resetPassword: async (data) => {
    const res = await backend1.post('/auth/reset-password', data);
    return res.data;
  },

  getProfile: async () => {
    const res = await backend1.get('/profile');
    return res.data;
  },
};
