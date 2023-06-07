import axios from "axios";

export default async function handler(req, res) {
  let { selectedCoin1, selectedCoin2, a } = req.query;
  const fee = 1.5; // 1.5% fee

  if (selectedCoin1 === "0x0000000000000000000000000000000000000000") {
    selectedCoin1 = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  } else if (selectedCoin2 === "0x0000000000000000000000000000000000000000") {
    selectedCoin2 = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  }

  try {
    const response = await axios.get(
      `https://api.1inch.exchange/v5.0/56/quote`,
      {
        params: {
          fromTokenAddress: selectedCoin1,
          toTokenAddress: selectedCoin2,
          amount: a,
          fee: fee,
        },
      }
    );

    const quote = response.data;

    // Add CORS headers to allow cross-origin requests
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type");

    res.status(200).json(quote);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch quote",
      coin1: selectedCoin1,
      coin2: selectedCoin2,
      amount: a,
    });
  }
}
