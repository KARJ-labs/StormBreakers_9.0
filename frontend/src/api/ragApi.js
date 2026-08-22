import { backend2 } from './apiClient';

/**
 * Global AI Intelligence RAG API (Backend 2 -> FastAPI RAG / Qdrant)
 * Answers general financial education, investing concepts, and platform questions.
 */
export const ragApi = {
  askRag: async ({ message }) => {
    const res = await backend2.post('/rag/chat', { message });
    return res.data;
  },

  checkRagHealth: async () => {
    try {
      const res = await backend2.get('/rith');
      return res.data;
    } catch {
      return { status: 'offline', service: 'rag-fastapi' };
    }
  },
};
