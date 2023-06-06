import axios from "axios";
export const runtime = "edge";
// Create an empty cache object
const cache = {};

export default async function handler(req, res) {
  const { ids, vs_currency } = req.query;
  const cacheKey = `coingecko-${ids}-${vs_currency}`;

  // Check if the response is already cached
  if (cache[cacheKey]) {
    const cachedResponse = cache[cacheKey];
    const currentTime = new Date().getTime();
    if (cachedResponse.expiry > currentTime) {
      // Cache is valid, return the cached response
      res.status(200).json(cachedResponse.data);
      return;
    }
    // Cache has expired, remove it
    delete cache[cacheKey];
  }

  try {
    // If data is not cached or expired, make the API request
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          ids,
          vs_currency,
          order: "market_cap_desc",
          per_page: 10,
          page: 1,
          sparkline: false,
        },
      }
    );

    const coins = response.data;

    const prices = {};
    for (const coin of coins) {
      prices[coin.id] = {
        price: coin.current_price,
        change_24h: coin.price_change_percentage_24h,
        image: coin.image,
      };
    }

    // Cache the response in the in-memory cache for 1 hour
    const expiry = new Date().getTime() + 60000;
    cache[cacheKey] = { data: prices, expiry };

    res.status(200).json(prices);
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(500).json({ CoingeckoAPIError: error.response.data });
      res.status(500).json({ Status: error.response.status });
      res.status(500).json({ Headers: error.response.headers });
    } else if (error.request) {
      // The request was made but no response was received
      res.status(500).json({ CoingeckoAPINoResponse: error.request });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({ CoingeckoAPIError: error.message });
    }

    res.status(500).json({ error: "Failed to fetch Coingecko data" });
  }
}
