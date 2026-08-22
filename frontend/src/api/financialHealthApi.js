import { backend1 } from './apiClient';

export const financialHealthApi = {
  getFinancialHealth: async () => {
    const res = await backend1.get('/financial-health');
    return res.data;
  },
};
