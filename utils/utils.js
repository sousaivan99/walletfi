"use client";
//Utils
import QRCode from "qrcode";

function truncateString(str) {
  if (str.length > 8) {
    return str.slice(0, 5) + "..." + str.slice(-4);
  } else {
    return str;
  }
}

//add data to element
function setDataInElement(id, data) {
  const element = document.getElementById(id);
  if (element) {
    element.innerHTML = data;
  } else {
    console.error(`Element with id ${id} not found.`);
  }
}
//get data to element
function getDataInElement(id) {
  return document.getElementById(id).innerHTML;
}
function getValueInElement(id) {
  return document.getElementById(id).value;
}
function getElement(id) {
  return document.getElementById(id);
}
function getMaxDripBalance() {
  const max = document.getElementById("DripBalance").innerHTML;
  document.getElementById("DripInput").value = max;
}
export function qrCode(id, qrLink) {
  const canvas = document.getElementById(id);

  if (!canvas) {
    console.error(`Canvas element with ID '${id}' not found.`);
    return;
  }

  canvas.innerHTML = ""; // This will clear the contents of the div

  try {
    QRCode.toCanvas(canvas, qrLink, function (error, canvas) {
      if (error) {
        console.error(error);
        return;
      }

      // Create a new anchor element
      const transactionLink = document.createElement("a");

      // Set the href and text of the anchor element
      transactionLink.href = qrLink;
      transactionLink.target = "_blank";
      transactionLink.textContent = `View transaction on BscScan:`;

      let linkContainer = "";
      // Get the container element
      if (document.getElementById("qr_link")) {
        linkContainer = document.getElementById("qr_link");
        // Append the link to the container element
        linkContainer.appendChild(transactionLink);
      } else {
        return;
      }
    });
  } catch (error) {
    console.error(error);
  }
}

function formatWEI(v) {
  // Format  as Ether
  const a = parseFloat(v) / 10 ** 18;
  if (a === 0) {
    return 0;
  }
  const formattedNumber = a.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 5,
  });
  return formattedNumber;
}

function formatNumberWithCommas(num, n) {
  let b = parseFloat(num).toFixed(2);
  const formatted = parseFloat(b).toLocaleString(undefined, {
    minimumFractionDigits: n,
    maximumFractionDigits: n,
  });
  return formatted;
}

module.exports = {
  truncateString,
  setDataInElement,
  getDataInElement,
  qrCode,
  formatNumberWithCommas,
  formatWEI,
  getElement,
  getValueInElement,
  getMaxDripBalance,
};
