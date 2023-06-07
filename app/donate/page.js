"use client";
import React, { useEffect, useState } from "react";
import TokenSelect from "@Components/tokenSelectDonation";
import tools from "@utils/utils";
const Donation = () => {
  useEffect(() => {
    tools.qrCode(
      "qrcode",
      "ethereum:0x09af76733671e79302264353251c1e134b56caca"
    );
  }, []);

  return (
    <>
      <div className="qrcode-cont">
        <TokenSelect></TokenSelect>
        <span>Or use QRcode</span>
        <canvas id="qrcode"></canvas>
        <div className="qrcode-text">
          <p>
            Thank you
            <svg
              className="heart"
              width={16}
              height={16}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
            </svg>
          </p>
        </div>
      </div>
    </>
  );
};

export default Donation;
