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

export async function decryptMessage(aesKey, text, msgIv) {
  const ciphertext = new Uint8Array(
    atob(text)
      .split("")
      .map((c) => c.charCodeAt(0))
  );

  const iv = new Uint8Array(msgIv);
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

export async function decryptGroupAESKey(encryptedKeyBase64) {
  const jwkPrivateKey = await getRsaPrivateKey(); // your JWK object

  if (!jwkPrivateKey) throw new Error("No private key found");

  // 🔑 Step 1: Import JWK into CryptoKey
  const privateKey = await crypto.subtle.importKey(
    "jwk",
    jwkPrivateKey,
    {
      name: "RSA-OAEP",
      hash: "SHA-256", // match your key's alg "RSA-OAEP-256"
    },
    true,
    ["decrypt"]
  );

  // 🔒 Step 2: Convert base64 string into Uint8Array buffer
  const encryptedBuffer = Uint8Array.from(
    atob(encryptedKeyBase64),
    (c) => c.charCodeAt(0)
  );

  // 🔓 Step 3: Decrypt the group AES key using RSA
  const aesKeyRaw = await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    privateKey, // now it's a proper CryptoKey
    encryptedBuffer
  );

  // 🔁 Step 4: Import decrypted AES key
  const aesKey = await crypto.subtle.importKey(
    "raw",
    aesKeyRaw,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );

  return aesKey;
}

export function base64ToUint8Array(base64) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
