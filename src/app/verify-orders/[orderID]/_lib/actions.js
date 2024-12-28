'use server'

import { cookies } from "next/headers";

const baseURL = "https://otp.qistbazaar.pk/api";

const key =  "QISt54653hsamE373Fhsdudklad3uh21jdsaREf746ReWhge476TYR8PrO3Kur2j"
export async function validateOTP(encryptedData, otp, orderID) {
  const cookieStore = cookies();
  try {
    const endpoint = `${baseURL}/otp/validate`; // Fully qualified URL
    const headers = {
      "x-access-token": key,
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({ encryptedData, otp });

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body,
    });
    console.log(response?.status)
    if (!response.ok || response?.status !== 200) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to validate OTP. Please try again."
      );
    }
    cookieStore.set("submitted", orderID, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7200, // 2 hours
    });


    return await response.json();
  } catch (error) {
    return {
      error:
        error?.message ||
        JSON.stringify(error) ||
        "Error Validating Please try again ",
    };
  }
}

export async function sendOTP(orderID) {
  try {
    const endpoint = `${baseURL}/otp`; // Fully qualified URL
    const headers = {
      "x-access-token": key,
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({ orderID });

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body,
    });

    if (!response.ok || response?.status !== 200) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch OTP. Please try again."
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending OTP:", error);
    return {error: error?.message || JSON.stringify(error) ||"Error Validating Please try again "};
  }
}

export async function setCookie(customerNumber, encryptedData, expiryTime) {
const cookieStore = cookies();
  cookieStore.set("customerNumber", customerNumber, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 120,
  });
  cookieStore.set("encryptedData", encryptedData, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 120,
  });
  cookieStore.set("otpExpiry", expiryTime, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 120,
  });
}