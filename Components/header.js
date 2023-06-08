"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Modal from "@Components/Modal/Modal";
import { motion, AnimatePresence } from "framer-motion";
import "@styles/header.css";
import useWeb3 from "@hooks/web3Hook";
const Header = () => {
  const { connect, addr, checkIfWalletIsConnected } = useWeb3();
  const [modalOpen, setModelOpen] = useState(false);
  const [error, setError] = useState("");
  const close = () => setModelOpen(false);
  const open = () => setModelOpen(true);
  const pathname = usePathname();

  const isActiveLink = (href) => {
    return pathname === href ? "active" : "";
  };
  const isActiveLink2 = (href) => {
    return pathname === href ? "active2" : "";
  };
  const isActiveLinkicon = (href) => {
    return pathname === href ? "activeIcon" : "";
  };
  const conn = async () => {
    const res = await connect();
    if (res) {
      console.log("connect: " + res.code + " " + res.message);
      setError("Error: " + res.code + " " + res.message);
      open();
    } else {
      console.log("connected");
    }
  };
  useEffect(() => {
    const changeMode = () => {
      // Toggle the "darkmode" class on the body element
      document.body.classList.toggle("darkmode");
      console.log("switch1");
    };
    const changeModemobile = () => {
      // Toggle the "darkmode" class on the body element
      document.body.classList.toggle("darkmode");
      console.log("switch2");
    };

    const darkModeToggle = document.getElementById("darkModeToggle");
    darkModeToggle.addEventListener("click", changeMode);
    const darkModeToggle2 = document.getElementById("darkModeTogglemobile");
    darkModeToggle2.addEventListener("click", changeModemobile);

    return () => {
      darkModeToggle.removeEventListener("click", changeMode);
      darkModeToggle2.removeEventListener("click", changeModemobile);
    };
  }, [error, modalOpen]);
  return (
    <>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {modalOpen && (
          <Modal modalOpen={modalOpen} handleClose={close} text={error} />
        )}
      </AnimatePresence>

      <header className="mobileHeader">
        <h1>
          <Link href="/">
            <span className="title">Wallet</span>
            <span className="title2">Fi</span>
          </Link>
        </h1>
        <div id="darkModeTogglemobile" className="theme">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 384 512"
          >
            <path d="M272 384c9.6-31.9 29.5-59.1 49.2-86.2l0 0c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63 31.4-100.3C368 78.8 289.2 0 192 0S16 78.8 16 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2 14.3 15.4 21.4l0 0c19.8 27.1 39.7 54.4 49.2 86.2H272zM192 512c44.2 0 80-35.8 80-80V416H112v16c0 44.2 35.8 80 80 80zM112 176c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-61.9 50.1-112 112-112c8.8 0 16 7.2 16 16s-7.2 16-16 16c-44.2 0-80 35.8-80 80z" />
          </svg>
        </div>

        <button className="mobileConnect">Connect</button>
      </header>
      <header className="header">
        <h1>
          <Link href="/">
            <span className="title">Wallet</span>
            <span className="title2">Fi</span>
          </Link>
        </h1>
        <button id="Connect" className="ConnectBtn" onClick={conn}>
          Connect
        </button>

        <div id="darkModeToggle" className="theme">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 384 512"
          >
            <path d="M272 384c9.6-31.9 29.5-59.1 49.2-86.2l0 0c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63 31.4-100.3C368 78.8 289.2 0 192 0S16 78.8 16 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2 14.3 15.4 21.4l0 0c19.8 27.1 39.7 54.4 49.2 86.2H272zM192 512c44.2 0 80-35.8 80-80V416H112v16c0 44.2 35.8 80 80 80zM112 176c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-61.9 50.1-112 112-112c8.8 0 16 7.2 16 16s-7.2 16-16 16c-44.2 0-80 35.8-80 80z" />
          </svg>
        </div>

        <div className="menu">
          <div className="links">
            <div className="link">
              <Link href="/" className={isActiveLink("/")}>
                <svg
                  className="menuSVG"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V192c0-35.3-28.7-64-64-64H80c-8.8 0-16-7.2-16-16s7.2-16 16-16H448c17.7 0 32-14.3 32-32s-14.3-32-32-32H64zM416 272a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                </svg>
                Wallet
              </Link>
            </div>
            <div className="link">
              <Link href="/swap" className={isActiveLink("/swap")}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path d="M438.6 150.6c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.7 96 32 96C14.3 96 0 110.3 0 128s14.3 32 32 32l306.7 0-41.4 41.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l96-96zm-333.3 352c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 416 416 416c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0 41.4-41.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3l96 96z" />
                </svg>
                Swap
              </Link>
            </div>
            <div className="link">
              <Link href="/calculator" className={isActiveLink("/calculator")}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM96 64H288c17.7 0 32 14.3 32 32v32c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32zm32 160a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM96 352a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM64 416c0-17.7 14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32zM192 256a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zm64-64a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM288 448a32 32 0 1 1 0-64 32 32 0 1 1 0 64z" />
                </svg>
                Calculator
              </Link>
            </div>
          </div>
          <div className="donate-cont">
            <div className="link">
              <Link href="/donate" className={isActiveLink("/donate")}>
                <svg
                  className="heart"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                </svg>
                Donate
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="bot-menu">
        <div className="links-bot ">
          <div className={isActiveLinkicon("/") + " link-bot"}>
            <Link href="/" className={isActiveLink2("/")}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V192c0-35.3-28.7-64-64-64H80c-8.8 0-16-7.2-16-16s7.2-16 16-16H448c17.7 0 32-14.3 32-32s-14.3-32-32-32H64zM416 272a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
              </svg>
            </Link>
          </div>
          <div className={isActiveLinkicon("/swap") + " link-bot"}>
            <Link href="/swap" className={isActiveLink2("/swap")}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M438.6 150.6c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.7 96 32 96C14.3 96 0 110.3 0 128s14.3 32 32 32l306.7 0-41.4 41.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l96-96zm-333.3 352c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 416 416 416c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0 41.4-41.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3l96 96z" />
              </svg>
            </Link>
          </div>
          <div className={isActiveLinkicon("/calculator") + " link-bot"}>
            <Link href="/calculator" className={isActiveLink2("/calculator")}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM96 64H288c17.7 0 32 14.3 32 32v32c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32zm32 160a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM96 352a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM64 416c0-17.7 14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32zM192 256a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zm64-64a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM288 448a32 32 0 1 1 0-64 32 32 0 1 1 0 64z" />
              </svg>
            </Link>
          </div>
          <div className="link-bot">
            <Link href="/donate" className={isActiveLink2("/donate")}>
              <svg
                className="heart"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
