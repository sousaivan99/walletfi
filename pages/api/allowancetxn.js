import axios from "axios";
export const runtime = "edge";

export default async function handler(req, res) {
  let { selectedCoin1 } = req.query;

  if (selectedCoin1 === "0x0000000000000000000000000000000000000000") {
    selectedCoin1 = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  }
  try {
    const response = await axios.get(
      `https://api.1inch.exchange/v5.0/56/approve/transaction?tokenAddress=${selectedCoin1}`
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({
      Message: "Failed to fetch txn",
      coin1: selectedCoin1,
      error: error,
    });
  }
}
