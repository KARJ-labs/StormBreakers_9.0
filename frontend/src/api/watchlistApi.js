import { backend1 } from './apiClient';

export const watchlistApi = {
  getWatchlist: async () => {
    const res = await backend1.get('/watchlist');
    return res.data;
  },

  addToWatchlist: async (data) => {
    const res = await backend1.post('/watchlist', data);
    return res.data;
  },

  removeFromWatchlist: async (symbol) => {
    const res = await backend1.delete(`/watchlist/${symbol}`);
    return res.data;
  },

  checkWatchlist: async (symbol) => {
    const res = await backend1.get(`/watchlist/check/${symbol}`);
    return res.data;
  },
};
