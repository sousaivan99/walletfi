import axios from "axios";
export const runtime = "edge";

export default async function handler(req, res) {
  const { address } = req.query;

  try {
    const response = await axios.get(
      `https://api.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=VC2HZFXPMRWFJKNRM6VSI6WG2C1DT4G5HJ`
    );

    const transactions = response.data.result;

    // Limit the result to the last 20 transactions
    const last20Transactions = transactions.slice(0, 20);

    const transactionDetails = last20Transactions.map((transaction) => {
      return {
        hash: formatTransactionHash(transaction.hash),
        age: formatTransactionAge(transaction.timeStamp),
        from: formatAddress(transaction.from),
        to: formatAddress(transaction.to),
        value: formatValue(transaction.value),
        fee: formatTransactionFee(transaction.gasPrice, transaction.gasUsed),
        fullTxnHash: transaction.hash, // Save the full transaction hash
      };
    });

    res.status(200).json(transactionDetails);
  } catch (error) {
    console.error("Failed to fetch transaction details:", error);
    res.status(500).json({ error: "Failed to fetch transaction details" });
  }
}

function formatTransactionHash(hash) {
  // Format transaction hash as 0xbffb21...
  return `${hash.substring(0, 10)}...`;
}

function formatTransactionAge(timeStamp) {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const transactionTimestamp = parseInt(timeStamp);
  const ageInSeconds = currentTimestamp - transactionTimestamp;

  // Convert age in seconds to days, hours, and minutes
  const days = Math.floor(ageInSeconds / 86400);
  const remainingSeconds = ageInSeconds % 86400;
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);

  // Build the formatted age string
  let formattedAge = "";
  if (days > 0) {
    formattedAge += `${days} day${days > 1 ? "s" : ""} `;
  }
  if (hours > 0) {
    formattedAge += `${hours} hr${hours > 1 ? "s" : ""} `;
  }
  if (minutes > 0) {
    formattedAge += `${minutes} min${minutes > 1 ? "s" : ""}`;
  }

  return formattedAge.trim();
}

function formatAddress(address) {
  // Format address as 0x1234...5678
  return `${address.substring(0, 5)}...${address.slice(-4)}`;
}

function formatValue(value) {
  // Format value in Wei to Ether with 2 decimal places
  const etherValue = parseFloat(value) / 1e18;
  const formattedNumber = etherValue.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 5,
  });
  return formattedNumber + " BNB";
}

function formatTransactionFee(gasPrice, gasUsed) {
  // Format transaction fee as Ether
  const fee = (parseFloat(gasPrice) * parseFloat(gasUsed)) / 10 ** 18;
  const formattedNumber = fee.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 5,
  });
  return formattedNumber + " BNB";
}
