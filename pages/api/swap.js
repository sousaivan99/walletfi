import axios from "axios";
export const runtime = "edge";

export default async function handler(req, res) {
  let { selected1, selected2, a, addr, slippage } = req.query;
  const fee = 1.5; // 1.5% fee
  console.log(selected1);
  console.log(selected2);

  if (selected1 === "0x0000000000000000000000000000000000000000") {
    selected1 = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  } else if (selected2 === "0x0000000000000000000000000000000000000000") {
    selected2 = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  }
  try {
    const response = await axios.get(
      `https://api.1inch.exchange/v5.0/56/swap?fromTokenAddress=${selected1}&toTokenAddress=${selected2}&amount=${a}&fromAddress=${addr}&slippage=${slippage}&referrerAddress=0x09af76733671e79302264353251c1e134b56caca&fee=${fee}&disableEstimate=true`
    );

    const swap = response.data;

    res.status(200).json(swap);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch swap",
      coin1: selected1,
      coin2: selected2,
      amount: a,
    });
  }
}
