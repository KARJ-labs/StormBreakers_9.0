import { backend1 } from './apiClient';

export const interestApi = {
  getInterests: async () => {
    const res = await backend1.get('/interests');
    return res.data;
  },

  createInterest: async ({ symbol, companyName, destinationPlatform = 'External Broker' }) => {
    const res = await backend1.post('/interests', {
      symbol,
      companyName,
      destinationPlatform,
    });
    return res.data;
  },

  deleteInterest: async (symbol) => {
    const res = await backend1.delete(`/interests/${symbol}`);
    return res.data;
  },
};
