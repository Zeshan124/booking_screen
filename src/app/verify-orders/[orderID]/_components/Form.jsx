"use client";
import React, { useRef, useState, useEffect } from "react";
import { setCookie, validateOTP } from "../_lib/actions";
import { useRouter } from "next/navigation";


const OTPForm = ({ otpExpiry, customerNumber, encryptedData, orderID, save }) => {
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(0);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (save){
      const saveCookie = async () => { await setCookie(customerNumber, encryptedData, otpExpiry) }
      saveCookie();
    }
    const savedExpiration = otpExpiry;

    const expirationTime = savedExpiration
      ? parseInt(savedExpiration, 10)
      : otpExpiry;



    const remainingTime = Math.max(
      0,
      expirationTime - Math.floor(Date.now() / 1000)
    );
    setTimer(remainingTime);

    if (remainingTime > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsResendEnabled(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setIsResendEnabled(true);
    }
  }, [otpExpiry]);

  const handleKeyDown = (e, index) => {
    if (
      !/^[0-9]{1}$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      !e.metaKey
    ) {
      e.preventDefault();
    }

    if (e.key === "Delete" || e.key === "Backspace") {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const onSubmitOTP = async (otp)=>{
    setIsSuccess(false);
    try {
      const result = await validateOTP(encryptedData, otp, orderID);
      if (result?.error){
        throw new Error(result?.error);
      }
      setIsSuccess(true);
    
    } catch (error) {
      console.error("OTP validation failed:", error?.message);
      setError(error?.message || error);
      inputRefs.current.forEach((input) => {
        if (input) input.value = "";
      });

      // Focus the first input field
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }
  }
  const handleInput = async (e, index) => {
    const value = e.target.value;
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // If it's the last input
    if (index === inputRefs.current.length - 1 && value) {
      const otp = inputRefs.current.map((input) => input.value).join("");
  

      // Add loading state
      setIsLoading(true);

      try {
        // Call your API
        await onSubmitOTP(otp);
      
      } catch (error) {
        console.error("Error submitting OTP:", error);
        inputRefs.current.forEach((input) => {
          if (input) input.value = "";
        });

        // Focus the first input field
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    if (!new RegExp(`^[0-9]{${inputRefs.current.length}}$`).test(text)) {
      return;
    }
    const digits = text.split("");
    inputRefs.current.forEach((input, index) => {
      if (index < digits.length) {
        input.value = digits[index];
      }
    });
    inputRefs.current[inputRefs.current.length - 1]?.focus();
  };

  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleResend = () => {

    const newExpirationTime = Math.floor(Date.now() / 1000) + 120; // Reset timer to 2 minutes
    localStorage.setItem("otpExpirationTime", newExpirationTime);
    setTimer(120);
    setIsResendEnabled(false);
    router.refresh();
 
  };

  return (
    <div className="max-w-md mx-auto">
      <form>
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              className={`sm:w-14 sm:h-14 h-10 w-10 text-center text-xl sm:text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded sm:p-4 p2 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              maxLength="1"
              onKeyDown={(e) => handleKeyDown(e, index)}
              onInput={(e) => handleInput(e, index)}
              onFocus={handleFocus}
              onPaste={handlePaste}
              disabled={isLoading}
            />
          ))}
        </div>
      </form>
      {isLoading && (
        <div className="mt-4 text-center">
          <span className="text-blue-500 font-medium">Submitting OTP...</span>
        </div>
      )}
      <div className="text-sm text-slate-500 mt-4 text-center">
        {error && <p className="text-red-500">{error}</p>}
        {isResendEnabled ? (
          <>
            
            <a
              className="font-medium text-blue-500 hover:text-indigo-600 cursor-pointer"
              onClick={handleResend}
            >
              <span className="text-slate-500 ">{`request code again?`}</span>
              {" "}
              Resend
            </a>
          </>
        ) : (
          <span>Resend available in {formatTime()}</span>
        )}
      </div>
    </div>
  );
};

export default OTPForm;
