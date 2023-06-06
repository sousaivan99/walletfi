"use client";
import React, { useEffect, useState, useCallback } from "react";
import "@styles/swap.css";
import BigNumber from "bignumber.js";
import useWeb3 from "@hooks/web3Hook";

const DripBuy = () => {
  const {
    addr,
    checkIfWalletIsConnected,
    addAddress,
    buyDrip,
    getBalance,
    estimateDrip,
  } = useWeb3();
  const [balance, setBalance] = useState("");

  const handleAccountsChanged = useCallback(async (address) => {
    await addAddress(address);
  });
  const get_Balance = async () => {
    const balance = await getBalance(
      "0x0000000000000000000000000000000000000000"
    );
    setBalance(balance);
  };
  const buy = async () => {
    const amount = document.getElementById("dripInput").value;
    await buyDrip(amount, addr);
  };
  const estimate = async () => {
    const amount = document.getElementById("dripInput").value;
    if (amount > 0) {
      await estimateDrip(amount);
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
              <img src="./bnb-logo.svg"></img>
              <span>BNB</span>
            </div>
            <span>Balance: {balance}</span>
          </div>
          <input
            id="dripInput"
            type="number"
            placeholder="0"
            onKeyUp={estimate}
          ></input>
          <div className="send-cont">
            <span>
              Minimum: <span id="estimate"></span>
            </span>
            <button onClick={buy}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DripBuy;
