"use client";
import React, { useEffect, useState, useCallback } from "react";
import Select from "react-select";
import "@styles/swap.css";
import BigNumber from "bignumber.js";
import Image from "next/image";
import useWeb3 from "@hooks/web3Hook";
const tools = require("@utils/utils.js");

const TokenSelect = ({ tokenList }) => {
  const {
    getBal,
    addr,
    checkIfWalletIsConnected,
    addAddress,
    getQuote,
    doSwap,
  } = useWeb3();
  const [balance, setBalance] = useState("");
  const [balance2, setBalance2] = useState("");
  const [selected1, setSelected1] = useState("");
  const [selected2, setSelected2] = useState("");
  const handleTokenChange = async (selectedToken) => {
    const balance1 = await getBal(selectedToken.value);
    setBalance(balance1);
    setSelected1(selectedToken.value);
    // Additional logic or state updates based on the selected token
  };
  const handleTokenChange2 = async (selectedToken) => {
    const balance2 = await getBal(selectedToken.value);
    setBalance2(balance2);
    setSelected2(selectedToken.value);
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

  const filteredOptions = selectOptions.filter(
    (option) =>
      option.value !== "0x20f663CEa80FaCE82ACDFA3aAE6862d246cE0333" &&
      option.value !== selected1
  );

  const handleAccountsChanged = useCallback(async (address) => {
    await addAddress(address);
  });

  const getQuoteRes = async () => {
    if (selected1 && selected2) {
      const a = document.getElementById("input1").value;
      if (a !== "") {
        const amount = new BigNumber(a).times(10 ** 18);
        const res = await getQuote(selected1, selected2, amount);
        const toTokenAmount = new BigNumber(res.toTokenAmount);
        let c = toTokenAmount.dividedBy(10 ** 18);
        document.getElementById("input2").value = c.toFixed(4);
        console.log("res: " + res);
        console.log("toTokenAmount: " + toTokenAmount);
        console.log("c: " + c);
      } else if (a === "") {
        document.getElementById("input2").value = "";
      }
    }
  };

  const getQuoteRes2 = async () => {
    if (selected1 && selected2) {
      const a = document.getElementById("input2").value;
      if (a !== "") {
        const amount = new BigNumber(a).times(10 ** 18);
        const res = await getQuote(selected2, selected1, amount);
        const toTokenAmount = new BigNumber(res.toTokenAmount);
        let c = toTokenAmount.dividedBy(10 ** 18);
        document.getElementById("input1").value = c.toFixed(4);
        console.log(c.toFixed(2));
      } else if (a === "") {
        document.getElementById("input1").value = "";
      }
    }
  };

  const swap = async () => {
    if (selected1 && selected2) {
      const a = document.getElementById("input1").value;
      const b = document.getElementById("input2").value;
      const slippage = "1";
      if (a !== "" && b !== "") {
        const amount = new BigNumber(a).times(10 ** 18);
        const res = await doSwap(selected1, selected2, amount, addr, slippage);
        await handleTokenChange2;
        await handleTokenChange;
        console.log(res);
        tools.qrCode("qrCode", res);
      }
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
      }
    };
    checkFetch();
  }, [addr]);

  useEffect(() => {
    getQuoteRes();
  }, [selected1, selected2]);
  return (
    <>
      <div className="swap-cont">
        <div className="select-div">
          <div className="select-div-top">
            <Select
              options={filteredOptions}
              styles={customStyles}
              isSearchable={false}
              className="swap-selectBox"
              onChange={handleTokenChange}
            />
            <span>Balance: {balance}</span>
          </div>
          <input
            id="input1"
            type="number"
            onKeyUp={getQuoteRes}
            placeholder="0"
          ></input>
        </div>

        <div className="select-div">
          <div className="select-div-top">
            <Select
              options={filteredOptions}
              styles={customStyles}
              isSearchable={false}
              className="swap-selectBox"
              onChange={handleTokenChange2}
            />
            <span>Balance: {balance2}</span>
          </div>
          <input
            id="input2"
            type="number"
            onKeyUp={getQuoteRes2}
            placeholder="0"
          ></input>
          <div className="send-cont2">
            <button onClick={swap}>Send</button>
          </div>
        </div>
      </div>
      <div>
        <div id="qrCode"></div>
        <div id="qr_link"></div>
      </div>
    </>
  );
};

export default TokenSelect;
