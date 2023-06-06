"use client";
import { useState } from "react";
import Web3 from "web3";
import tokenContracts from "@crypto/tokenContracts.json";
import axios from "axios";

import BigNumber from "bignumber.js";

const tools = require("@utils/utils.js");

const LPABI = require("@abi/lptoken.json");

// connect to the Binance Smart Chain
const web3 = new Web3(window.ethereum);

//DripLiq Contract
const dripLQAddress = "0x4Fe59AdcF621489cED2D674978132a54d432653A";
const dripLQContract = new web3.eth.Contract(LPABI, dripLQAddress);

function useWeb3() {
  const [addr, setAddress] = useState();
  let accounts = [];
  const TOKEN_ABI = [
    // ERC-20 standard functions
    {
      constant: true,
      inputs: [{ name: "_owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "balance", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ];

  const connect = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const address = accounts[0];
        setAddress(address);
        tools.setDataInElement("Connect", tools.truncateString(address));
      } catch (error) {
        console.error(error);
        return error;
      }
    } else {
      return "Please install MetaMask";
    }
  };
  const addAddress = async (address) => {
    setAddress(address);
  };
  const checkIfWalletIsConnected = async () => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        const address = accounts[0];
        setAddress(address);
        tools.setDataInElement("Connect", tools.truncateString(address));
        // Call the getBalance function to update the balance

        // Add any additional logic or state updates based on the connected wallet
      } catch (error) {
        console.error(error);
      }
    } else {
      tools.setDataInElement("Connect", "Connect Wallet");
    }
  };

  const getPrices = async () => {
    const internalApiUrl = "/api/coingecko";
    const vsCurrency = "usd"; // Set the desired currency here

    try {
      const tokenIds = tokenContracts
        .map((token) => token.coingeckoId)
        .join(",");

      const response = await axios.get(internalApiUrl, {
        params: {
          ids: tokenIds,
          vs_currency: vsCurrency,
        },
      });

      return response.data;
    } catch (error) {
      console.log("Failed to get prices:", error);
      return {};
    }
  };

  const addTableRows = async (table, balances) => {
    const fragment = document.createDocumentFragment();
    const prices = await getPrices();

    for (const token of tokenContracts) {
      const { name, coingeckoId } = token;
      const balance = balances[name];
      const price = prices[coingeckoId]?.price;
      const percentage = prices[coingeckoId]?.change_24h;
      const imageUrl = prices[coingeckoId]?.image;

      const row = document.createElement("tr");

      const logoCell = document.createElement("td");
      const logoImg = document.createElement("img");
      logoImg.src = imageUrl;
      logoImg.alt = `${name} Logo`;
      logoCell.appendChild(logoImg);
      row.appendChild(logoCell);

      const nameCell = document.createElement("td");
      nameCell.textContent = name;
      row.appendChild(nameCell);

      const priceCell = document.createElement("td");
      priceCell.textContent = "$" + price.toFixed(2);
      row.appendChild(priceCell);

      const percentageCell = document.createElement("td");
      percentageCell.textContent = percentage.toFixed(2) + "%";

      if (percentage > 0) {
        percentageCell.style.color = "#6CC6FF";
      } else if (percentage < 0) {
        percentageCell.style.color = "#FE7474";
      }

      row.appendChild(percentageCell);

      const balanceCell = document.createElement("td");

      const availableDiv = document.createElement("div");
      availableDiv.className = "available";

      if (price) {
        const avPriceSpan = document.createElement("span");
        avPriceSpan.className = "avPrice";
        avPriceSpan.textContent = "$" + (price * balance).toFixed(2);
        availableDiv.appendChild(avPriceSpan);
      }

      const avBalanceSpan = document.createElement("span");
      avBalanceSpan.className = "avBalance";
      avBalanceSpan.textContent = balance + " " + name;
      availableDiv.appendChild(avBalanceSpan);

      balanceCell.appendChild(availableDiv);
      row.appendChild(balanceCell);

      fragment.appendChild(row);
    }

    const tbody = table.querySelector("tbody");
    if (tbody) {
      tbody.remove();
    }

    const newTbody = document.createElement("tbody");
    newTbody.appendChild(fragment);
    table.appendChild(newTbody);
  };

  const getBalances = async () => {
    try {
      const updatedBalances = {};
      const balancePromises = tokenContracts.map(async (token) => {
        if (token.address === "0x0000000000000000000000000000000000000000") {
          return web3.eth.getBalance(addr);
        } else {
          const tokenContract = new web3.eth.Contract(TOKEN_ABI, token.address);
          return tokenContract.methods.balanceOf(addr).call();
        }
      });

      const balances = await Promise.all(balancePromises);

      for (let i = 0; i < tokenContracts.length; i++) {
        const token = tokenContracts[i];
        const { name } = token;
        const balance = balances[i];

        const formattedBalance = tools.formatWEI(balance, 4);
        updatedBalances[name] = formattedBalance;
      }

      const table = document.getElementById("wallet-table");
      if (!table) {
        throw new Error("Table element with id 'wallet-table' not found.");
      }

      addTableRows(table, updatedBalances);

      return updatedBalances;
    } catch (error) {
      console.log("Failed to get balances:", error);
    }
  };
  const getTransaction = async () => {
    const table = document.getElementById("transaction-table");
    if (!table) {
      throw new Error("Table element with id 'wallet-table' not found.");
    }

    addTableRowsTransaction(table);
  };
  const fetchTransaction = async () => {
    const internalApiUrl = "/api/bscscan";

    try {
      const response = await axios.get(internalApiUrl, {
        params: {
          address: addr,
        },
      });

      return response.data;
    } catch (error) {
      console.log("Failed to get transaction:", error);
      return {};
    }
  };

  const addTableRowsTransaction = async (table) => {
    const fragment = document.createDocumentFragment();
    const transactions = await fetchTransaction();

    for (const transaction of transactions) {
      const { hash, age, from, to, value, fee, fullTxnHash } = transaction;

      const row = document.createElement("tr");

      const hashCell = document.createElement("td");
      const hashLink = document.createElement("a");
      hashLink.href = `https://bscscan.com/tx/${fullTxnHash}`; // Replace 'bscscan.com' with the actual BscScan URL if necessary
      hashLink.target = "_blank";
      hashLink.textContent = hash;
      hashCell.appendChild(hashLink);
      row.appendChild(hashCell);

      const ageCell = document.createElement("td");
      ageCell.textContent = age;
      row.appendChild(ageCell);

      const fromCell = document.createElement("td");
      fromCell.textContent = from;
      row.appendChild(fromCell);

      const toCell = document.createElement("td");
      toCell.textContent = to;
      row.appendChild(toCell);

      const valueCell = document.createElement("td");
      valueCell.textContent = value;
      row.appendChild(valueCell);

      const feeCell = document.createElement("td");
      feeCell.textContent = fee;
      row.appendChild(feeCell);

      fragment.appendChild(row);
    }

    const tbody = table.querySelector("tbody");
    if (tbody) {
      tbody.remove();
    }

    const newTbody = document.createElement("tbody");
    newTbody.appendChild(fragment);
    table.appendChild(newTbody);
  };

  const getBalance = async (tokenaddress) => {
    try {
      const balancePromise = async () => {
        if (tokenaddress === "0x0000000000000000000000000000000000000000") {
          return web3.eth.getBalance(addr);
        } else {
          const tokenContract = new web3.eth.Contract(TOKEN_ABI, tokenaddress);
          return tokenContract.methods.balanceOf(addr).call();
        }
      };

      const balance = await Promise.all([balancePromise()]); // Invoke balancePromise as a function

      const formattedBalance = tools.formatWEI(balance, 4);
      const truncatedBalance = Number(formattedBalance).toFixed(4); // Truncate the decimal places

      return truncatedBalance;
    } catch (error) {
      console.log("Failed to get balance:", error);
    }
  };

  const getQuote = async (selectedCoin1, selectedCoin2, amount1) => {
    const internalApiUrl = "/api/quote";
    const big = new BigNumber(amount1);
    const a = big.toFixed();

    try {
      const response = await axios.get(internalApiUrl, {
        params: {
          selectedCoin1,
          selectedCoin2,
          a,
        },
      });

      return response.data;
    } catch (error) {
      console.log("Failed to get quote:", error);
      return {};
    }
  };
  async function estimateDrip(amount) {
    try {
      if (amount) {
        const aToBuy = web3.utils.toWei(amount.toString(), "ether");
        const price = await dripLQContract.methods
          .getBnbToTokenInputPrice(aToBuy)
          .call();
        tools.setDataInElement("estimate", tools.formatWEI(price * 0.97, 2));
        return price * 0.97;
      } else {
        tools.setDataInElement("estimate", 0);
      }
    } catch (error) {
      console.log(amount);
      console.log(error);
    }
  }
  async function estimateSellDrip(amount) {
    try {
      if (amount) {
        const aToBuy = web3.utils.toWei(amount.toString(), "ether");
        const price = await dripLQContract.methods
          .getTokenToBnbInputPrice(aToBuy)
          .call();
        tools.setDataInElement(
          "estimateSell",
          tools.formatWEI(price * 0.97, 2)
        );
        return price * 0.87;
      } else {
        tools.setDataInElement("estimateSell", 0);
      }
    } catch (error) {
      console.log(amount);
      console.log(error);
    }
  }

  async function buyDrip(amount, addr) {
    try {
      const payableAmount = document.getElementById("dripInput").value;
      const WeiPayableAmount = web3.utils.toWei(
        payableAmount.toString(),
        "ether"
      );
      if (amount) {
        await dripLQContract.methods
          .bnbToTokenSwapInput(WeiPayableAmount.toString())
          .send({
            from: addr, // Provide the "from" address
            value: WeiPayableAmount.toString(), // Include the desired amount of ether to send
          });
      } else {
        console.log("Amount Empty");
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function sellDrip(amount, addr) {
    try {
      const payableAmount = document.getElementById("dripSell").value;
      const WeiPayableAmount = web3.utils.toWei(
        payableAmount.toString(),
        "ether"
      );
      const min = parseInt(await estimateSellDrip(amount));
      console.log("Min: " + min / 10 ** 18);
      if (amount) {
        await dripLQContract.methods
          .tokenToBnbSwapInput(WeiPayableAmount.toString(), min.toString())
          .send({
            from: addr, // Provide the "from" address
          });
      } else {
        console.log("Amount Empty");
      }
    } catch (error) {
      console.log(error);
    }
  }
  const checkAllowance = async (selectedCoin1, addr) => {
    const internalApiUrl = "/api/checkAllowance";
    try {
      const response = await axios.get(internalApiUrl, {
        params: {
          selectedCoin1,
          addr,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  const allowanceTxn = async (selectedCoin1) => {
    const internalApiUrl = "/api/allowancetxn";
    console.log("allowanceTxn: " + selectedCoin1);
    try {
      const response = await axios.get(internalApiUrl, {
        params: {
          selectedCoin1,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const doSwap = async (selected1, selected2, amount, addr, slippage) => {
    const internalApiUrl = "/api/swap";
    const big = new BigNumber(amount);
    const a = big.toFixed();

    const allowance = await checkAllowance(selected1, addr);
    if (allowance === "0") {
      const txn = await allowanceTxn(selected1);
      let transactionReceipt = "";
      try {
        transactionReceipt = await web3.eth.sendTransaction({
          ...txn,
          from: addr, // Replace YOUR_FROM_ADDRESS with the actual from address
        });
      } catch (error) {
        console.log("Failed to send transaction:", error);
        return {};
      }
      if (transactionReceipt) {
        try {
          const response = await axios.get(internalApiUrl, {
            params: {
              selected1,
              selected2,
              a,
              addr,
              slippage,
            },
          });

          const gasLimit = response.data.tx.estimateGas;
          const tx = {
            ...response.data.tx,
            gas: gasLimit,
          };

          try {
            const transactionReceipt = await web3.eth.sendTransaction({
              ...tx,
              from: addr, // Replace YOUR_FROM_ADDRESS with the actual from address
            });
            const transactionCode = transactionReceipt.transactionHash; // Get the transaction code from the transaction receipt
            const qrLink = `https://bscscan.com/tx/${transactionCode}`; // Replace with your QR code generation logic or API endpoint
            return qrLink;
          } catch (error) {
            console.log("Failed to send transaction:", error);
            return {};
          }
        } catch (error) {
          console.log("Failed to initiate swap:", error);
          return {};
        }
      }
    } else {
      try {
        const response = await axios.get(internalApiUrl, {
          params: {
            selected1,
            selected2,
            a,
            addr,
            slippage,
          },
        });

        const gasLimit = response.data.tx.estimateGas;
        const tx = {
          ...response.data.tx,
          gas: gasLimit,
        };

        try {
          const transactionReceipt = await web3.eth.sendTransaction(tx);
          const transactionCode = transactionReceipt.transactionHash; // Get the transaction code from the transaction receipt
          const qrLink = `https://bscscan.com/tx/${transactionCode}`; // Replace with your QR code generation logic or API endpoint

          return qrLink;
        } catch (error) {
          console.log("Failed to send transaction:", error);
          return {};
        }
      } catch (error) {
        console.log("Failed to initiate swap:", error);
        return {};
      }
    }
  };

  return {
    connect,
    checkIfWalletIsConnected,
    getBalances,
    addr,
    getPrices,
    getTransaction,
    getBalance,
    addAddress,
    getQuote,
    doSwap,
    buyDrip,
    sellDrip,
    estimateDrip,
    checkAllowance,
    estimateSellDrip,
  }; // Return the connect function
}
export default useWeb3;
