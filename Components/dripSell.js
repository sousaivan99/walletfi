"use client";
import React, { useEffect, useState, useCallback } from "react";
import "@styles/swap.css";
import BigNumber from "bignumber.js";
import useWeb3 from "@hooks/web3Hook";

const DripSell = () => {
  const {
    addr,
    checkIfWalletIsConnected,
    addAddress,
    sellDrip,
    getBalance,
    estimateSellDrip,
  } = useWeb3();
  const [balance, setBalance] = useState("");

  const handleAccountsChanged = useCallback(async (address) => {
    await addAddress(address);
  });
  const get_Balance = async () => {
    const balance = await getBalance(
      "0x20f663CEa80FaCE82ACDFA3aAE6862d246cE0333"
    );
    setBalance(balance);
  };
  const sell = async () => {
    const amount = document.getElementById("dripSell").value;
    await sellDrip(amount, addr);
  };
  const estimate = async () => {
    const amount = document.getElementById("dripSell").value;
    if (amount > 0) {
      await estimateSellDrip(amount);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        handleAccountsChanged(accounts[0]);
      });
    }
    const checkFetch = async () => {
      await checkIfWalletIsConnected();
      if (addr) {
        await get_Balance();
      }
    };
    checkFetch();
  }, [addr]);

  return (
    <>
      <div className="swap-cont">
        <div className="select-div">
          <div className="select-div-top">
            <div className="token">
              <img src="./drip-logo.png"></img>
              <span>DRIP</span>
            </div>
            <span>Balance: {balance}</span>
          </div>
          <input
            id="dripSell"
            type="number"
            placeholder="0"
            onKeyUp={estimate}
          ></input>
          <div className="send-cont">
            <span>
              Minimum: <span id="estimateSell"></span>
            </span>
            <button onClick={sell}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DripSell;
