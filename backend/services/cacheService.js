const CompanyCache = require("../model/companyCache");

const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedCompany = async (symbol) => {
  try {
    if (!symbol || typeof symbol !== "string") {
      return null;
    }

    const normalizedSymbol = symbol.trim().toUpperCase();

    const cachedCompany = await CompanyCache.findOne({
      symbol: normalizedSymbol,
      expiresAt: {
        $gt: new Date(),
      },
    }).lean();

    if (!cachedCompany) {
      return null;
    }

    return cachedCompany;
  } catch (error) {
    console.error(`Cache read error for ${symbol}:`, error.message);

    // Cache failure should not stop the application.
    return null;
  }
};

const setCachedCompany = async (
  symbol,
  data,
  duration = DEFAULT_CACHE_DURATION,
) => {
  try {
    if (!symbol || typeof symbol !== "string") {
      return null;
    }

    if (!data || typeof data !== "object") {
      return null;
    }

    const normalizedSymbol = symbol.trim().toUpperCase();

    const now = new Date();

    const expiresAt = new Date(now.getTime() + duration);

    const cacheData = {
      symbol: normalizedSymbol,

      company: data.company || {},

      market: data.market || {},

      metrics: data.metrics || {},

      cachedAt: now,

      expiresAt,
    };

    const cachedCompany = await CompanyCache.findOneAndUpdate(
      {
        symbol: normalizedSymbol,
      },
      {
        $set: cacheData,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    ).lean();

    return cachedCompany;
  } catch (error) {
    console.error(`Cache write error for ${symbol}:`, error.message);

    // Cache failure should not break the API.
    return null;
  }
};

const deleteCachedCompany = async (symbol) => {
  try {
    if (!symbol || typeof symbol !== "string") {
      return false;
    }

    const normalizedSymbol = symbol.trim().toUpperCase();

    const result = await CompanyCache.deleteOne({
      symbol: normalizedSymbol,
    });

    return result.deletedCount > 0;
  } catch (error) {
    console.error(`Cache delete error for ${symbol}:`, error.message);

    return false;
  }
};

const clearCompanyCache = async () => {
  try {
    const result = await CompanyCache.deleteMany({});

    return {
      success: true,
      deletedCount: result.deletedCount,
    };
  } catch (error) {
    console.error("Clear company cache error:", error.message);

    return {
      success: false,
      deletedCount: 0,
    };
  }
};

module.exports = {
  getCachedCompany,
  setCachedCompany,
  deleteCachedCompany,
  clearCompanyCache,
};
