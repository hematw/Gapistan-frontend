import { set, get, del } from "idb-keyval";

const PRIVATE_KEY_NAME = "ecdhe-private-key";

// Save private key in browser
export async function storePrivateKey(key) {
    await set(PRIVATE_KEY_NAME, key);
}

export async function getPrivateKey() {
    return await get(PRIVATE_KEY_NAME);
}

export async function deletePrivateKey() {
    await del(PRIVATE_KEY_NAME);
}
