import { backend1 } from './apiClient';

/**
 * Company Smart Analyzer API (Backend 1 -> Gemini LLM)
 * Personalized company suitability and risk analysis tailored to the authenticated user's financial profile.
 */
export const analyzerApi = {
  analyzeCompany: async ({ question, company }) => {
    const res = await backend1.post('/company-analyzer', {
      question,
      company: {
        symbol: company.symbol,
        name: company.name || company.symbol,
      },
    });
    return res.data;
  },
};
