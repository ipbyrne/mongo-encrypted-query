import {
  createEntrypedQuery,
  createEncryptedObject,
  createDecryptedObject,
} from "./utils";
import { decrypt, generate } from "./cipher/cipher";
import { PrivateKeyJwk, Data } from "./types";
import * as Types from "./types";

export const encryptQuery = (query: any, privateKeyJwk: PrivateKeyJwk) => {
  const hashedQuery = createEntrypedQuery(query, privateKeyJwk);
  return hashedQuery;
};

export const encryptData = (data: Data, privateKeyJwk: PrivateKeyJwk) => {
  const encryptedData = createEncryptedObject(data, privateKeyJwk);
  return encryptedData;
};

export const decryptData = (data: any, privateKeyJwk: PrivateKeyJwk): any => {
  const type = typeof data;
  if (Array.isArray(data)) {
    return data.map((d: any) => decryptData(d, privateKeyJwk));
  }

  if (type === "object") {
    let id;
    if (data._id) {
      id = data._id;
      delete data._id;
    }
    const decryptedData = createDecryptedObject(
      data,
      privateKeyJwk as PrivateKeyJwk
    );
    decryptedData._id = id;
    return decryptedData;
  }
  return decrypt(data, privateKeyJwk as PrivateKeyJwk);
};

export default {
  encryptQuery,
  encryptData,
  decryptData,
  generateEncryptionKeyPair: generate,
  Types,
};
