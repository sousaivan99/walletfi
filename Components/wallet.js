"use client";
import React, { useEffect, useState, useCallback } from "react";
import Modal from "@Components/Modal/walletModal";
import { motion, AnimatePresence } from "framer-motion";
import "@styles/wallet.css";
import "@styles/table.css";
import useWeb3 from "@hooks/web3Hook";

const Wallet = () => {
  const { getBalances, addr, checkIfWalletIsConnected, addAddress } = useWeb3();
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModelOpen] = useState(false);
  const close = () => setModelOpen(false);
  const open = () => setModelOpen(true);

  const handleAccountsChanged = useCallback(async (address) => {
    await addAddress(address);
  });

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        handleAccountsChanged(accounts[0]);
      });
    }
    const checkFetch = async () => {
      setIsLoading(true);
      await checkIfWalletIsConnected();
      if (addr) {
        await getBalances();
        setIsLoading(false);
      }
    };
    checkFetch();
  }, [addr]);

  return (
    <div className="wallet-cont">
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {modalOpen && (
          <Modal
            modalOpen={modalOpen}
            handleClose={close}
            text="Only Supported Tokens will be shown!"
            text2=" Supported Tokens are BNB, BUSD, USDT, USDC, DRIP"
          />
        )}
      </AnimatePresence>
      <motion.div
        className="wallet-header"
        onClick={() => (modalOpen ? close() : open())}
      >
        <h2>Your Wallet</h2>
        <svg
          className="infoIcon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
        </svg>
      </motion.div>
      <div className="overflow-table">
        <table id="wallet-table" className="tablewallet">
          <thead
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "var(--white)",
              zIndex: 1, // Add a higher z-index value
            }}
          >
            <tr>
              <th></th>
              <th>Name</th>
              <th>Price</th>
              <th>24h%</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <>
                <tr className="skeleton">
                  <td>
                    <div></div>
                  </td>
                  <td>
                    <div></div>
                  </td>
                  <td>
                    <div></div>
                  </td>
                  <td>
                    <div></div>
                  </td>
                  <td>
                    <div></div>
                  </td>
                </tr>
                <tr className="skeleton">
                  <td>
                    <div></div>
                  </td>
                  <td>
                    <div></div>
                  </td>
                  <td>
                    <div></div>
                  </td>
                  <td>
                    <div></div>
                  </td>
                  <td>
                    <div></div>
                  </td>
                </tr>
                <tr className="skeleton">
                  <td>
                    <div></div>
                  </td>
                  <td>
                    <div></div>
                  </td>
                  <td>
                    <div></div>
                  </td>
                  <td>
                    <div></div>
                  </td>
                  <td>
                    <div></div>
                  </td>
                </tr>
              </>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Wallet;
