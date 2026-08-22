import { backend1 } from './apiClient';

export const investmentApi = {
  getInvestments: async () => {
    const res = await backend1.get('/investments');
    return res.data;
  },

  createInvestment: async (investmentData) => {
    const res = await backend1.post('/investments', investmentData);
    return res.data;
  },

  updateInvestment: async (id, investmentData) => {
    const res = await backend1.put(`/investments/${id}`, investmentData);
    return res.data;
  },

  deleteInvestment: async (id) => {
    const res = await backend1.delete(`/investments/${id}`);
    return res.data;
  },
};
