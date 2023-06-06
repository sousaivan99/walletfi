"use client";
import React, { useState, useEffect } from "react";
import "@styles/calculator.css";
import Wallet from "@Components/wallet";

const calculator = () => {
  const [principle, setPrinciple] = useState(0);
  const [price, setPrice] = useState(1);
  const [day, setdays] = useState(0);
  const [day2, setday2] = useState(0);
  const [day3, setday3] = useState(0);
  const [dailyInterest, setdailyInterest] = useState(0);
  function formatNumber(number) {
    return number.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function calculateCompound(a, p, d, di) {
    const principal = parseFloat(a);
    const interestRate = parseFloat(di) / 100;

    //setting days in the future
    const day2 = d * 2;
    const day3 = parseFloat(d * 2) + parseFloat(d);
    setday3(day3);
    setday2(day2);

    //calculate compound
    const compoundAmount = principal * (1 + interestRate) ** d;

    const total$ = compoundAmount.toFixed(2) * p;
    document.getElementById("total").innerHTML = formatNumber(compoundAmount);
    document.getElementById("total$").innerHTML =
      "($" + formatNumber(total$) + ")";
    const daily = compoundAmount * 0.01;
    const dailyDollar = compoundAmount * 0.01 * p;
    document.getElementById("1%").innerHTML =
      formatNumber(daily) + "/day " + "($" + formatNumber(dailyDollar) + ")";

    //calculate compound further in the future

    const compoundAmount2 = principal * Math.pow(1 + interestRate, day2);

    const total$2 = compoundAmount2.toFixed(2) * p;
    document.getElementById("total2").innerHTML = formatNumber(compoundAmount2);
    document.getElementById("total$2").innerHTML =
      "($" + formatNumber(total$2) + ")";
    const daily2 = compoundAmount2 * 0.01;
    const dailyDollar2 = compoundAmount2 * 0.01 * p;
    document.getElementById("1%2").innerHTML =
      formatNumber(daily2) + "/day " + "($" + formatNumber(dailyDollar2) + ")";

    //calculate compound even further in the future
    const compoundAmount3 = principal * Math.pow(1 + interestRate, day3);

    const total$3 = compoundAmount3.toFixed(2) * p;
    document.getElementById("total3").innerHTML = formatNumber(compoundAmount3);
    document.getElementById("total$3").innerHTML =
      "($" + formatNumber(total$3) + ")";
    const daily3 = compoundAmount3 * 0.01;
    const dailyDollar3 = compoundAmount3 * 0.01 * p;
    document.getElementById("1%3").innerHTML =
      formatNumber(daily3) + "/day " + "($" + formatNumber(dailyDollar3) + ")";
  }
  const handleAmountChange = (event) => {
    const amountInput = event.target.value;
    setPrinciple(amountInput);
  };
  const handlePriceChange = (event) => {
    const priceInput = event.target.value;
    setPrice(priceInput);
  };
  const handleDay = (event) => {
    const dayInput = event.target.value;
    setdays(dayInput);
    setday2(dayInput * 2);
    const d3 = parseFloat(dayInput * 2) + parseFloat(dayInput);

    setday3(d3);
  };
  const handleDailyInterest = (event) => {
    const dailyInput = event.target.value;
    setdailyInterest(dailyInput);
  };

  useEffect(() => {
    if (principle && price && day && dailyInterest) {
      calculateCompound(principle, price, day, dailyInterest);
    } else {
      document.getElementById("total").innerHTML = "0";
      document.getElementById("total$").innerHTML = "($0)";
      document.getElementById("1%").innerHTML = "0/day ($0)";
      document.getElementById("total2").innerHTML = "0";
      document.getElementById("total$2").innerHTML = "($0)";
      document.getElementById("1%2").innerHTML = "0/day ($0)";
      document.getElementById("total3").innerHTML = "0";
      document.getElementById("total$3").innerHTML = "($0)";
      document.getElementById("1%3").innerHTML = "0/day ($0)";
    }
  }, [principle, price, day, dailyInterest, day2, day3]);
  return (
    <>
      <Wallet />
      <div className="cont">
        <div className="calculator-header">
          <h2>Compound Calculator</h2>
        </div>
        <div className="calculator-cont">
          <div className="calculator-settings">
            <div>
              <span>Amount: </span>{" "}
              <input
                type="number"
                id="amount"
                onKeyUp={handleAmountChange}
              ></input>
            </div>
            <div>
              <span>Price: </span>{" "}
              <input
                type="number"
                id="price"
                onKeyUp={handlePriceChange}
              ></input>
            </div>
            <div>
              <span>Days: </span>{" "}
              <input type="number" id="days" onKeyUp={handleDay}></input>
            </div>
            <div>
              <span>Daily interest:</span>
              <input
                type="number"
                id="interest"
                onKeyUp={handleDailyInterest}
              ></input>
            </div>
          </div>
          <div className="calculator-output-cont">
            <div className="calculator-output">
              <div>
                <span id="cal-title">Day {day}</span>
              </div>
              <div className="cal-daily">
                <div>
                  <span id="total"></span>
                  <span id="total$"></span>
                </div>
                <span id="1%"></span>
              </div>
            </div>
            <div className="calculator-output">
              <div>
                <span id="cal-title">Day {day2}</span>
              </div>
              <div className="cal-daily">
                <div>
                  <span id="total2"></span>
                  <span id="total$2"></span>
                </div>
                <span id="1%2"></span>
              </div>
            </div>
            <div className="calculator-output">
              <div>
                <span id="cal-title">Day {day3}</span>
              </div>
              <div className="cal-daily">
                <div>
                  <span id="total3"></span>
                  <span id="total$3"></span>
                </div>
                <span id="1%3"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default calculator;
