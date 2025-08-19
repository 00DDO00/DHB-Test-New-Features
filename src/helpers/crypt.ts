// Import CryptoJS (if using npm)
import CryptoJS from "crypto-js";
import crypto from "crypto";

// Encryption function
export function encryptData(data: any, secretKey: string) {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secretKey
  ).toString();
  return encryptedData;
}

// Decryption function
export function decryptData(encryptedData: any, secretKey: string) {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
}

export function generateSecureKey() {
  // Generate a 32-byte (256-bit) random key
  const key = crypto.randomBytes(32).toString("hex"); // Convert to hexadecimal string
  return key;
}
