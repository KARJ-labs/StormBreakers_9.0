import { backend1 } from './apiClient';

export const portfolioApi = {
  getPortfolio: async () => {
    const res = await backend1.get('/portfolio');
    return res.data;
  },

  getPortfolioSummary: async () => {
    const res = await backend1.get('/portfolio/summary');
    return res.data;
  },

  addHolding: async (holdingData) => {
    const res = await backend1.post('/portfolio', holdingData);
    return res.data;
  },

  updateHolding: async (symbol, holdingData) => {
    const res = await backend1.put(`/portfolio/${symbol}`, holdingData);
    return res.data;
  },

  removeHolding: async (symbol) => {
    const res = await backend1.delete(`/portfolio/${symbol}`);
    return res.data;
  },
};
