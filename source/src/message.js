import { attachProofOfWork, generateId } from './util';

export const type = {
  TEXT: "text",
  REBROADCAST: "rebroadcast",
  COMMENT: "comment",
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

export const createText = (senderId, text) => {
  const message = create(senderId);
  return attachProofOfWork({
    ...message,
    type: type.TEXT,
    text
  });
};

export const createRebroadcast = (senderId) => {
  const message = create(senderId);
  return attachProofOfWork({
    ...message,
    type: type.REBROADCAST,
  });
};

export const createComment = (senderId, reMessageId, text) => {
  const message = create(senderId);
  return attachProofOfWork({
    ...message,
    type: type.COMMENT,
    reMessageId,
    text,
  });
};