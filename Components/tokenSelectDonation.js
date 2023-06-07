"use client";
import React, { useEffect, useState, useCallback } from "react";
import Select from "react-select";
import "@styles/donate.css";
import tokenList from "@crypto/tokenContracts";
import Image from "next/image";
import useWeb3 from "@hooks/web3Hook";
const tools = require("@utils/utils.js");

const TokenSelect = () => {
  const { getBal, addr, checkIfWalletIsConnected, addAddress, donate } =
    useWeb3();
  const [balance, setBalance] = useState("");
  const [selected1, setSelected1] = useState("");
  const handleTokenChange = async (selectedToken) => {
    const balance1 = await getBal(selectedToken.value);
    setBalance(balance1);
    setSelected1(selectedToken.value);
    // Additional logic or state updates based on the selected token
  };
  const customStyles = {
    control: () => ({
      // Add your control container styles here
      border: "0",
      height: "40px",
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
    }),
    valueContainer: () => ({
      // Add your value container styles here
      height: "100%",
      width: "fit-content",
      display: "flex",
      alignItems: "center",
      flex: "1",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    singleValue: () => ({
      // Add your value container styles here
      height: "100%",
      width: "auto",
      display: "flex",
      alignItems: "center",
    }),
    option: (state) => ({
      display: "flex",
      alignItems: "center",
      height: "100%",
      cursor: "pointer",
      padding: "1em",
      backgroundColor: state.isFocused ? "#007bff" : "transparent",
      color: state.isFocused ? "#fff" : "#333",
      "&:hover": {
        backgroundColor: "#007bff",
        color: "#fff",
      },
    }),
    optionImage: {
      height: "20px",
      width: "20px",
      marginRight: "8px",
    },
    listbox: () => ({}),
  };

  const customOptionRenderer = (option) => (
    <div className="swap-selectBox__option">
      <Image
        src={option.logo}
        alt={option.name}
        style={customStyles.optionImage}
        width={15}
        height={15}
      />
      {option.name}
    </div>
  );
  const selectOptions = tokenList.map((token) => ({
    value: token.address,
    label: customOptionRenderer(token),
  }));

  const handleAccountsChanged = async (address) => {
    await addAddress(address);
  };

  const send = async () => {
    if (selected1) {
      const a = document.getElementById("input1").value;
      if (a !== "") {
        // const amount = new BigNumber(a).times(10 ** 18);
        const res = await donate(selected1, a, addr);
        console.log(res);
      }
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts) => {
        handleAccountsChanged(accounts[0]);
      });
    }

    const checkFetch = async () => {
      await checkIfWalletIsConnected();
    };
    checkFetch();
  }, [addr]);

  useEffect(() => {}, [selected1]);
  return (
    <>
      <div className="donate-cont">
        <div className="donate-select-div">
          <div className="donate-select-div-top">
            <Select
              options={selectOptions}
              styles={customStyles}
              isSearchable={false}
              className="donate-selectBox"
              onChange={handleTokenChange}
            />
            <span>Balance: {balance}</span>
          </div>
          <input id="input1" type="number" placeholder="0"></input>
          <button className="donate-send" onClick={send}>
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default TokenSelect;
