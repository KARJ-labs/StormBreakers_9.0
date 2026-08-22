import { backend1 } from './apiClient';

export const companyApi = {
  getCompanyDetails: async (symbol) => {
    const res = await backend1.get(`/companies/${symbol}`);
    return res.data;
  },

  getCompanyMetrics: async (symbol) => {
    const res = await backend1.get(`/companies/${symbol}/metrics`);
    return res.data;
  },

  getCompanyHistory: async (symbol, resolution = 'D', from, to) => {
    const res = await backend1.get(
      `/companies/${symbol}/history?resolution=${resolution}&from=${from}&to=${to}`
    );
    return res.data;
  },

  getCompanyRisk: async (symbol) => {
    const res = await backend1.get(`/companies/${symbol}/risk`);
    return res.data;
  },
};
