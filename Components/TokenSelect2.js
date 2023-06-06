"use client";
import React from "react";
import Select from "react-select";
import Image from "next/image";
import "@styles/swap.css";

const TokenSelect = ({ tokenList, check }) => {
  const handleTokenChange = (selectedToken) => {
    console.log("Selected Token:", selectedToken);
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
      />
      {option.name}
    </div>
  );

  const selectOptions = tokenList.map((token) => ({
    value: token.address,
    label: customOptionRenderer(token),
  }));

  const defaultValue = selectOptions.find(
    (option) => option.label.props.children[1] === "BNB"
  );
  const defaultValue2 = selectOptions.find(
    (option) => option.label.props.children[1] === "DRIP"
  );
  const selectedDefaultValue = check === "1" ? defaultValue : defaultValue2;

  return (
    <Select
      options={selectOptions}
      defaultValue={selectedDefaultValue}
      styles={customStyles}
      isSearchable={false}
      className="swap-selectBox"
      onChange={handleTokenChange}
    />
  );
};

export default TokenSelect;
