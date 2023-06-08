"use client";
import React, { useState } from "react";
import TokenSelect from "@Components/TokenSelect";
import tokenList from "@crypto/tokenContracts";
import Modal from "@Components/Modal/Modal";
import { motion, AnimatePresence } from "framer-motion";
import DripBuy from "@Components/dripBuy";
import DripSell from "@Components/dripSell";
import "@styles/swap.css";

const Swap = () => {
  const [modalOpen, setModelOpen] = useState(false);
  const [modalOpen2, setModelOpen2] = useState(false);
  const [modalOpen3, setModelOpen3] = useState(false);

  const openModal = (modal) => {
    setModelOpen(false);
    setModelOpen2(false);
    setModelOpen3(false);

    switch (modal) {
      case 1:
        setModelOpen(true);
        break;
      case 2:
        setModelOpen2(true);
        break;
      case 3:
        setModelOpen3(true);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="cont">
        <div className="swap-cont">
          <AnimatePresence
            initial={false}
            mode="wait"
            onExitComplete={() => null}
          >
            {modalOpen && (
              <Modal
                modalOpen={modalOpen}
                handleClose={() => setModelOpen(false)}
                text="All Swaps have a 1.5% fee to support WalletFi!"
              />
            )}
          </AnimatePresence>
          <motion.div className="swap-header" onClick={() => openModal(1)}>
            <h2>Swap</h2>
            <svg
              className="infoIcon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
            </svg>
          </motion.div>

          <TokenSelect tokenList={tokenList} />
        </div>
        <span className="infoApprove">
          When approving, please wait a bit. Your wallet will open automatically
          to execute the swap.
        </span>
        <div>
          <div id="qrCode"></div>
          <div id="qr_link"></div>
        </div>
      </div>
      <div className="BuySell">
        <div className="swap-conter">
          <div className="component">
            <AnimatePresence
              initial={false}
              mode="wait"
              onExitComplete={() => null}
            >
              {modalOpen2 && (
                <Modal
                  modalOpen={modalOpen2}
                  handleClose={() => setModelOpen2(false)}
                  text="There are no fees. Drip Dex is used!"
                />
              )}
            </AnimatePresence>
            <motion.div className="swap-header" onClick={() => openModal(2)}>
              <h2>Buy DRIP</h2>
              <svg
                className="infoIcon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
              </svg>
            </motion.div>
            <DripBuy />
          </div>
        </div>
        <div className="swap-conter">
          <div className="component">
            <AnimatePresence
              initial={false}
              mode="wait"
              onExitComplete={() => null}
            >
              {modalOpen3 && (
                <Modal
                  modalOpen={modalOpen3}
                  handleClose={() => setModelOpen3(false)}
                  text="10% fees. Drip Dex is used!"
                />
              )}
            </AnimatePresence>
            <motion.div className="swap-header" onClick={() => openModal(3)}>
              <h2>Sell DRIP</h2>
              <svg
                className="infoIcon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
              </svg>
            </motion.div>
            <DripSell />
          </div>
        </div>
      </div>
    </>
  );
};

export default Swap;
