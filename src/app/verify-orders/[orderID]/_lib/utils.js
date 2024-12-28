import CryptoJS from "crypto-js";
const SECRET_KEY = process.env.DecryptionKey_SECRET_KEY;

export function decryptOrderID(encryptedOrderID) {
  try {
    // Decode URL-safe Base64
    const decoded = decodeURIComponent(encryptedOrderID);
    const bytes = CryptoJS.AES.decrypt(decoded, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return ("Invalid or corrupted encrypted data");
  }
}
export function encryptOrderID(orderID) {
  const encrypted = CryptoJS.AES.encrypt(orderID.toString(), SECRET_KEY).toString();
  // Convert to URL-safe Base64
  return encodeURIComponent(encrypted);
}

export function hidePhoneNumber(phoneNumber) {
  const visibleLength = 3; // Number of visible digits at the end
  const hiddenPart = phoneNumber.slice(3, -visibleLength).replace(/\d/g, "*");
  const visiblePart1 = phoneNumber.slice(0, 3);
  const visiblePart2 = phoneNumber.slice(-visibleLength);
  return `${visiblePart1}${hiddenPart}${visiblePart2}`;
}
