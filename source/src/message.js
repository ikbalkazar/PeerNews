import { attachProofOfWork, attachSignature, generateId } from './util';
import { sign } from 'tweetnacl';
import { encodeBase64 } from 'tweetnacl-util';

export const type = {
  TEXT: "text",
  REBROADCAST: "rebroadcast",
  COMMENT: "comment",
  VOTE: "vote",
};

export const createSender = (name) => {
  const { publicKey, secretKey } = sign.keyPair();
  console.log(publicKey);
  console.log(secretKey);
  return {
    id: encodeBase64(publicKey),
    keyPair: {
      privateKey: secretKey,
      publicKey,
    },
    name,
  };
};

const MESSAGE_ID_RANGE = 10000000;

const create = (sender) => {
  const messageId = generateId(MESSAGE_ID_RANGE);
  const timestamp = Date.now();
  return {
    senderId: sender.id,
    senderName: sender.name,
    messageId,
    timestamp
  };
};

const readyEnvelope = (message, keyPair) => {
  const { publicKey, privateKey } = keyPair;
  return attachSignature(attachProofOfWork(message), publicKey, privateKey);
};

export const createText = (sender, title, text, topics) => {
  const message = create(sender);
  return readyEnvelope({
      ...message,
      type: type.TEXT,
      title,
      text,
      topics,
    },
    sender.keyPair,
  );
};

export const createRebroadcast = (sender) => {
  const message = create(sender);
  return readyEnvelope({
      ...message,
      type: type.REBROADCAST,
    },
    sender.keyPair,
  );
};

export const createComment = (sender, reMessageId, text) => {
  const message = create(sender);
  return readyEnvelope({
      ...message,
      type: type.COMMENT,
      reMessageId,
      text,
    },
    sender.keyPair,
  );
};

export const createVote = (sender, reMessageId, delta) => {
  const message = create(sender);
  return readyEnvelope({
      ...message,
      type: type.VOTE,
      reMessageId,
      delta,
    },
    sender.keyPair
  );
};