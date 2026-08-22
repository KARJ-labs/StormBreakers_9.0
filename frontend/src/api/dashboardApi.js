import { backend1 } from './apiClient';

export const dashboardApi = {
  getDashboard: async () => {
    const res = await backend1.get('/dashboard');
    return res.data;
  },
};
