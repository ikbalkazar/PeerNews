import { attachProofOfWork, attachSignature, generateId } from './util';
import { sign } from 'tweetnacl';
import { encodeBase64 } from 'tweetnacl-util';

export const type = {
  TEXT: "text",
  REBROADCAST: "rebroadcast",
  COMMENT: "comment",
};

export const createSender = () => {
  const { publicKey, secretKey } = sign.keyPair();
  console.log(publicKey);
  console.log(secretKey);
  return {
    id: encodeBase64(publicKey),
    keyPair: {
      privateKey: secretKey,
      publicKey,
    }
  };
};

const MESSAGE_ID_RANGE = 10000000;

const create = (senderId) => {
  const messageId = generateId(MESSAGE_ID_RANGE);
  const timestamp = Date.now();
  return {
    senderId,
    messageId,
    timestamp
  };
};

const readyEnvelope = (message, keyPair) => {
  const { publicKey, privateKey } = keyPair;
  return attachSignature(attachProofOfWork(message), publicKey, privateKey);
};

export const createText = (sender, text) => {
  const message = create(sender.id);
  return readyEnvelope({
      ...message,
      type: type.TEXT,
      text
    },
    sender.keyPair,
  );
};

export const createRebroadcast = (sender) => {
  const message = create(sender.id);
  return readyEnvelope({
      ...message,
      type: type.REBROADCAST,
    },
    sender.keyPair,
  );
};

export const createComment = (sender, reMessageId, text) => {
  const message = create(sender.id);
  return attachProofOfWork({
      ...message,
      type: type.COMMENT,
      reMessageId,
      text,
    },
    sender.keyPair,
  );
};