"use client";
import React, { useState } from "react";
import QRCode from "qrcode";

const Page = () => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateQR = () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);

    const options = {
      width: 400,
      margin: 2,
    };

    QRCode.toDataURL(inputValue, options)
      .then((qrCodeUrl) => {
        // Draw the QR code and custom image on a canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = 400;
        canvas.height = 450; // Extra height for custom image

        const qrImg = new Image();
        qrImg.onload = () => {
          // Draw QR code
          ctx.drawImage(qrImg, 0, 0, 400, 400);

          const customImg = new Image();
          customImg.onload = () => {
            // Draw custom image at the bottom, resized to fit the canvas width
            const imgWidth = 200; // Set to canvas width
            const imgHeight = 53; // Scale height based on aspect ratio
            ctx.drawImage(customImg, 100, 400, imgWidth, imgHeight);

            // Generate final image and download
            const finalImageUrl = canvas.toDataURL();
            handleDownloadQR(finalImageUrl);
            setIsLoading(false); // Stop loading
          };
          customImg.src = "/qistbazaar.png"; // Path to your custom image
        };
        qrImg.src = qrCodeUrl;
      })
      .catch(() => setIsLoading(false)); // Handle errors
  };

  const handleDownloadQR = (finalImageUrl) => {
    const link = document.createElement("a");
    link.href = finalImageUrl;
    link.download = `QR-Code.png`; // Default filename
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          QR Code Generator
        </h1>
        <input
          type="text"
          className="border border-gray-300 rounded-md p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter text to generate QR code"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          onClick={handleGenerateQR}
          disabled={isLoading}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Generating..." : "Generate QR Code"}
        </button>
      </div>

      {/* Footer Section */}
      <footer className="mt-10 text-center">
        <img
          src="/qistbazaar.png"
          alt="Qistbazaar Logo"
          className="w-32 mx-auto mb-2"
        />
        <p className="text-gray-600">
          Powered by{" "}
          <a
            href="https://qistbazaar.pk"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Qistbazaar.pk
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Page;
