import { backend1 } from './apiClient';

export const expenseApi = {
  getExpenses: async (params = {}) => {
    const res = await backend1.get('/expenses', { params });
    return res.data;
  },

  getExpenseSummary: async (period = 'monthly') => {
    const res = await backend1.get(`/expenses/summary?period=${period}`);
    return res.data;
  },

  getExpenseById: async (id) => {
    const res = await backend1.get(`/expenses/${id}`);
    return res.data;
  },

  createExpense: async (expenseData) => {
    const res = await backend1.post('/expenses', expenseData);
    return res.data;
  },

  updateExpense: async (id, expenseData) => {
    const res = await backend1.put(`/expenses/${id}`, expenseData);
    return res.data;
  },

  deleteExpense: async (id) => {
    const res = await backend1.delete(`/expenses/${id}`);
    return res.data;
  },
};
