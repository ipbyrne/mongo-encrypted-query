import { generateKeyPair } from "jose/util/generate_key_pair";
import { exportJWK } from "jose/key/export";
import { PrivateKeyJwk } from "../types";
import crypto from "crypto";

const enc = "aes-256-gcm";

const crvToAlg: { [x: string]: string } = {
  X25519: "ECDH-ES+A256KW",
};

export const generate = async (crv = "X25519") => {
  const alg = crvToAlg[crv];
  const { publicKey, privateKey } = await generateKeyPair(alg, {
    crv,
  });
  const publicKeyJwk = await exportJWK(publicKey);
  const privateKeyJwk = await exportJWK(privateKey);
  return { publicKeyJwk, privateKeyJwk };
};

export const encrypt = (data: any, privateKeyJwk: PrivateKeyJwk) => {
  const encoder = new TextEncoder();
  const encodedPrivateKey = encoder.encode(privateKeyJwk.d).slice(0, 32);
  const initVector = encoder.encode(privateKeyJwk.d).slice(0, 16);
  const cipher = crypto.createCipheriv(enc, encodedPrivateKey, initVector);
  const dataType = typeof data;
  return cipher.update(
    dataType === "string" ? data : JSON.stringify(data),
    "utf-8",
    "hex"
  );
};

export const decrypt = (ciphertext: string, privateKeyJwk: PrivateKeyJwk) => {
  const encoder = new TextEncoder();
  const encodedPrivateKey = encoder.encode(privateKeyJwk.d).slice(0, 32);
  const initVector = encoder.encode(privateKeyJwk.d).slice(0, 16);
  const decipher = crypto.createDecipheriv(enc, encodedPrivateKey, initVector);
  const decryptedData = decipher.update(ciphertext, "hex", "utf-8");
  return decryptedData;
};
