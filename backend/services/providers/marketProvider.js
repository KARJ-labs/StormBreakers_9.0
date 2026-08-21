const marketApi = require("../../config/marketApi");

const getQuote = async (symbol) => {
  const response = await marketApi.get("/quote", {
    params: {
      symbol,
    },
  });

  return response.data;
};

const getCompanyProfile = async (symbol) => {
  const response = await marketApi.get("/stock/profile2", {
    params: {
      symbol,
    },
  });

  return response.data;
};

const getCompanyMetrics = async (symbol) => {
  const response = await marketApi.get("/stock/metric", {
    params: {
      symbol,
      metric: "all",
    },
  });

  return response.data;
};

const searchCompanies = async (query) => {
  const response = await marketApi.get("/search", {
    params: {
      q: query,
    },
  });

  return response.data;
};

const getCompanies = async () => {
  const response = await marketApi.get("/stock/symbol", {
    params: {
      exchange: "US",
    },
  });

  return response.data;
};

const getHistoricalData = async (symbol, resolution, from, to) => {
  const response = await marketApi.get("/stock/candle", {
    params: {
      symbol,
      resolution,
      from,
      to,
    },
  });

  return response.data;
};

module.exports = {
  getQuote,
  getCompanyProfile,
  getCompanyMetrics,
  searchCompanies,
  getCompanies,
  getHistoricalData,
};
