const axios = require("axios");

const marketApi = axios.create({
  baseURL: process.env.MARKET_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

marketApi.interceptors.request.use(
  (config) => {
    config.params = {
      ...config.params,
      token: process.env.MARKET_API_KEY,
    };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

module.exports = marketApi;
