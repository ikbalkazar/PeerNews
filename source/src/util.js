import sha256 from 'crypto-js/sha256';
import Hex from 'crypto-js/enc-hex';
import { sign } from 'tweetnacl';
import {
  encodeUTF8,
  decodeUTF8,
  encodeBase64,
  decodeBase64
} from 'tweetnacl-util';

export const generateId = upperBound =>
  `${Math.floor(Math.random() * upperBound)}`;

const WORK_REQUIRED = 4; // 16 bits should be 0 in hex, ~2^16 iterations
const SALT_BOUND = 1000000000;


export const verifyProofOfWork = (message) => {
  if (!message.proofOfWork) {
    return false;
  }
  const provenMessage = JSON.stringify(message);
  const hash = Hex.stringify(sha256(provenMessage));
  for (let i = 63; i >= 63 - WORK_REQUIRED + 1; i--) {
    if (hash[i] !== '0') {
      return false;
    }
  }
  return true;
};

export const attachProofOfWork = (message) => {
  console.log("Started generating proof of work");
  let iterations = 0;
  while (true) {
    iterations += 1;
    const proofOfWork = generateId(SALT_BOUND);
    const candidate = {...message, proofOfWork};
    if (verifyProofOfWork(candidate)) {
      console.log(`Found proof of work in ${iterations} iterations`);
      return candidate;
    }
  }
};

const objectToBytes = x => decodeUTF8(JSON.stringify(x));
const bytesToObject = x => JSON.parse(encodeUTF8(x));

export const attachSignature = (message, publicKey, privateKey) => {
  const signedMessage = encodeBase64(sign(objectToBytes(message), privateKey));
  return {
    senderPublicKey: encodeBase64(publicKey),
    signedMessage,
  };
};

export const verifySignatureAndDecode = (message) => {
  console.log(`${JSON.stringify(message)}`);
  const { senderPublicKey, signedMessage } = message;
  const originalMessage = sign.open(decodeBase64(signedMessage), decodeBase64(senderPublicKey));
  if (!originalMessage) {
    return null;
  }
  return bytesToObject(originalMessage);
};

export const toList = (iter) => {
  const res = [];
  for (const item of iter) {
    res.push(item);
  }
  return res;
};

export const ROUTES = {
  feed: "3",
  compose: "4",
  focus: "5"
};

export const ROUTE_NAME = {
  "3": 'Feed',
  "4": 'Compose',
};
