export const generateId = upperBound =>
  `${Math.floor(Math.random() * upperBound)}`;

export const createMessage = (senderId, text) => {
  const messageId = generateId(10000000);
  const timestamp = Date.now();
  return JSON.stringify({
    from: senderId,
    messageId,
    text,
    timestamp,
  });
};