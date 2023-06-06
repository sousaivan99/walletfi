import axios from "axios";
export const runtime = "edge";

export default async function handler(req, res) {
  let { selectedCoin1, addr } = req.query;

  if (selectedCoin1 === "0x0000000000000000000000000000000000000000") {
    selectedCoin1 = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  }
  try {
    const response = await axios.get(
      `https://api.1inch.io/v5.0/56/approve/allowance?tokenAddress=${selectedCoin1}&walletAddress=${addr}`
    );

    const allowance = response.data.allowance;

    res.status(200).json(allowance);
  } catch (error) {
    res.status(500).json({
      Message: "Failed to fetch allowance",
      coin1: selectedCoin1,
      address: addr,
      error: error,
    });
  }
}
