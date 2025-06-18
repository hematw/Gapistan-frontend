import { getRsaPrivateKey, storeRsaPrivateKey } from "../services/keyManager";
import axiosIns from "./axios";

export async function generateECDHKeyPair() {
  return await window.crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey"]
  );
}

export async function exportPublicKey(key) {
  return await window.crypto.subtle.exportKey("jwk", key);
}

export async function importPublicKey(jwk) {
  return await window.crypto.subtle.importKey(
    "jwk",
    jwk,
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    []
  );
}

// Derive AES-GCM key from your privateKey + their publicKey
export async function deriveSharedAESKey(privateKey, otherPublicKey) {
  return await crypto.subtle.deriveKey(
    {
      name: "ECDH",
      public: otherPublicKey,
    },
    privateKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encryptMessage(aesKey, plaintext) {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    aesKey,
    encoder.encode(plaintext)
  );
  return { ciphertext, iv };
}

export async function decryptMessage(aesKey, ciphertext, iv) {
  console.log("decryptMessage", aesKey, ciphertext, iv);
  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    aesKey,
    ciphertext
  );
  return new TextDecoder().decode(decrypted);
}

export async function savePrivateKeyToLocal(privateKey) {
  const exported = await crypto.subtle.exportKey("jwk", privateKey);
  localStorage.setItem("ecdhPrivateKey", JSON.stringify(exported));
}

export async function loadPrivateKeyFromLocal() {
  const item = localStorage.getItem("ecdhPrivateKey");
  if (!item) return null;
  const jwk = JSON.parse(item);
  return await crypto.subtle.importKey(
    "jwk",
    jwk,
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey"]
  );
}

export async function generateAndSaveRSAKeys() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  // Export public key to send to server
  const publicKeyJwk = await window.crypto.subtle.exportKey(
    "jwk",
    keyPair.publicKey
  );

  // Export private key to store securely (e.g., IndexedDB or localStorage encrypted)
  const privateKeyJwk = await window.crypto.subtle.exportKey(
    "jwk",
    keyPair.privateKey
  );

  storeRsaPrivateKey(privateKeyJwk);

  await axiosIns.put("/users/rsa-public-key", {
    rsaPublicKey: publicKeyJwk,
  });

  return { publicKey: publicKeyJwk, privateKey: privateKeyJwk };
}

export async function decryptGroupKey(encryptedGroupKeyBase64) {
  const privateKey = await getRsaPrivateKey();

  if (!privateKey) {
    throw new Error("RSA Private Key not found in storage");
  }

  // Convert from base64 to ArrayBuffer
  const encryptedBuffer = Uint8Array.from(atob(encryptedGroupKeyBase64), c => c.charCodeAt(0));

  // Decrypt using SubtleCrypto
  const decryptedKeyBuffer = await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    privateKey,
    encryptedBuffer
  );

  return decryptedKeyBuffer; // This is your AES key as ArrayBuffer
}

export async function importAESKey(rawKeyBuffer) {
  return await window.crypto.subtle.importKey(
    "raw",
    rawKeyBuffer,
    "AES-GCM",
    true,
    ["encrypt", "decrypt"]
  );
}
