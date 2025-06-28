import { set, get, del } from "idb-keyval";

// Generic functions
export async function storePrivateKey(id, key) {
    await set(`ecdhe-private-key:${id}`, key);
}

export async function getPrivateKey(id) {
    return await get(`ecdhe-private-key:${id}`);
}

export async function deletePrivateKey(id) {
    await del(`ecdhe-private-key:${id}`);
}

// ===== RSA Key =====
export async function storeRsaPrivateKey(id, key) {
    await set(`rsa-private-key:${id}`, key);
}

export async function getRsaPrivateKey(id) {
    return await get(`rsa-private-key:${id}`);
}

export async function deleteRsaPrivateKey(id) {
    await del(`rsa-private-key:${id}`);
}
