"use client";
import React, { useEffect, useState, useCallback } from "react";
import Modal from "@Components/Modal/Modal";
import { motion, AnimatePresence } from "framer-motion";
import "@styles/wallet.css";
import "@styles/transaction.css";
import Image from "next/image";
import useWeb3 from "@hooks/web3Hook";

const Transaction = () => {
  const { addr, checkIfWalletIsConnected, getTransaction, addAddress } =
    useWeb3();
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
        await getTransaction();
        setIsLoading(false);
      }
    };
    checkFetch();
    const interval = setInterval(checkFetch, 60000); // Fetch every 5 seconds

    return () => {
      clearInterval(interval); // Cleanup the interval when the component unmounts
    };
  }, [addr]);
  return (
    <div className="transaction-cont">
      <div className="wallet-cont">
        <AnimatePresence
          initial={false}
          mode="wait"
          onExitComplete={() => null}
        >
          {modalOpen && (
            <Modal
              modalOpen={modalOpen}
              handleClose={close}
              text="Only the last 20 transaction will be shown!"
            />
          )}
        </AnimatePresence>
        <motion.div
          className="wallet-header"
          onClick={() => (modalOpen ? close() : open())}
        >
          <h2>Your Transaction</h2>
          <svg
            className="infoIcon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
          </svg>
        </motion.div>
        <div className="overflow-table">
          <table id="transaction-table" className="tabletxn">
            <thead
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: "var(--white)",
                zIndex: 1, // Add a higher z-index value
              }}
            >
              <tr>
                <th>Txn Hash</th>
                <th>Age</th>
                <th>From</th>
                <th>To</th>
                <th>Value</th>
                <th>Txn Fee</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
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
                    <td>
                      <div></div>
                    </td>
                  </tr>
                </>
              )}
              {!isLoading && (
                <>
                  {/* Render table rows with actual data */}
                  {/* Modify the code as per your requirements */}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
