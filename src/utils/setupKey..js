import {
  getPrivateKey,
  getRsaPrivateKey,
  storePrivateKey,
} from "../services/keyManager";
import axiosIns from "./axios";
import {
  exportPublicKey,
  generateAndSaveRSAKeys,
  generateECDHKeyPair,
} from "./crypto";

export async function setupKeysAndSendToServer(userId) {
  const keyPair = await generateECDHKeyPair();
  const publicJwk = await exportPublicKey(keyPair.publicKey);

  await storePrivateKey(userId, keyPair.privateKey);
  console.log("Setyp and Save:", userId, keyPair, publicJwk);

  await axiosIns.put("/users/public-key", { publicKey: publicJwk });
}

export async function setupKeysForUser(userId) {
  const aesKey = await getPrivateKey(userId);
  const rsaKey = await getRsaPrivateKey(userId);

  if (!aesKey) {
    console.log("AES key not exist");
    await setupKeysAndSendToServer(userId);
  }

  if (!rsaKey) {
    console.log("RSA key not exist");
    await generateAndSaveRSAKeys(userId);
  }
}
