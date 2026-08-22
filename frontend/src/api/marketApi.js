import { backend1 } from './apiClient';

export const marketApi = {
  getMarketOverview: async () => {
    const res = await backend1.get('/market/overview');
    return res.data;
  },

  getCompanies: async () => {
    const res = await backend1.get('/market/companies');
    return res.data;
  },

  getTrending: async () => {
    const res = await backend1.get('/market/trending');
    return res.data;
  },

  searchCompanies: async (q) => {
    const res = await backend1.get(`/market/search?q=${encodeURIComponent(q)}`);
    return res.data;
  },

  getQuote: async (symbol) => {
    const res = await backend1.get(`/market/quote/${symbol}`);
    return res.data;
  },

  getHistoricalData: async (symbol, resolution = 'D', from, to) => {
    const res = await backend1.get(
      `/market/historical/${symbol}?resolution=${resolution}&from=${from}&to=${to}`
    );
    return res.data;
  },
};
