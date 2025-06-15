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
export async function deriveSharedAESKey(
    privateKey,
    otherPublicKey
) {
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
