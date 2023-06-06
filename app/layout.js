"use client";
import React, { useEffect, useState, useCallback } from "react";
import "./globals.css";
import { Roboto } from "next/font/google";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import Header from "@Components/header";
import Banner from "@Components/banner";
import UseWeb3 from "@hooks/web3Hook";
import { debounce } from "lodash";

library.add(fas);

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  style: ["normal", "italic"],
});

export default function RootLayout({ children }) {
  const { addr, checkIfWalletIsConnected, addAddress } = UseWeb3();
  const [isLoading, setIsLoading] = useState(true);

  const handleAccountsChanged = useCallback(
    debounce(async (address) => {
      await addAddress(address);
    }, 300), // Adjust the debounce delay as needed (e.g., 1000ms)
    []
  );

  useEffect(() => {
    const check = async () => {
      await checkIfWalletIsConnected();
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        handleAccountsChanged(accounts[0]);
      });
    }
    check();
  }, [addr, checkIfWalletIsConnected, handleAccountsChanged]);
  return (
    <>
      <html lang="en">
        <head>
          <title>WalletFi</title>
        </head>
        <body className={roboto.className + " " + "wrapper"}>
          <Header />

          <main>
            <Banner />
            <div className="content">{children}</div>
          </main>
        </body>
      </html>
    </>
  );
}
