import { backend1 } from './apiClient';

export const financialProfileApi = {
  getFinancialProfile: async () => {
    const res = await backend1.get('/financial-profile');
    return res.data;
  },

  createFinancialProfile: async (profileData) => {
    const res = await backend1.post('/financial-profile', profileData);
    return res.data;
  },

  updateFinancialProfile: async (profileData) => {
    const res = await backend1.put('/financial-profile', profileData);
    return res.data;
  },
};
