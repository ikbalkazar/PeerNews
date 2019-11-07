import sha256 from 'crypto-js/sha256';
import Hex from 'crypto-js/enc-hex';

export const generateId = upperBound =>
  `${Math.floor(Math.random() * upperBound)}`;

const WORK_REQUIRED = 3; // 12 bits should be 0 in hex
const SALT_BOUND = 1000000000;


export const verifyProofOfWork = (message) => {
  if (!message.proofOfWork) {
    return false;
  }
  const provenMessage = JSON.stringify(message);
  const hash = Hex.stringify(sha256(provenMessage));
  console.log(`Verifying ${hash} ${hash[255]} ${hash[254]}`);
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
