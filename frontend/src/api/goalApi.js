import { backend1 } from './apiClient';

export const goalApi = {
  getGoals: async (params = {}) => {
    const res = await backend1.get('/goals', { params });
    return res.data;
  },

  getGoalById: async (id) => {
    const res = await backend1.get(`/goals/${id}`);
    return res.data;
  },

  getGoalProgress: async (id) => {
    const res = await backend1.get(`/goals/${id}/progress`);
    return res.data;
  },

  createGoal: async (goalData) => {
    const res = await backend1.post('/goals', goalData);
    return res.data;
  },

  updateGoal: async (id, goalData) => {
    const res = await backend1.put(`/goals/${id}`, goalData);
    return res.data;
  },

  deleteGoal: async (id) => {
    const res = await backend1.delete(`/goals/${id}`);
    return res.data;
  },
};
