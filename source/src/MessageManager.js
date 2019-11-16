import { verifyProofOfWork, verifySignatureAndDecode, toList, createLogger } from './util';
import * as Message from './message';
import MessageStore from './MessageStore';

const log = createLogger('MessageManager');

const DISK_WRITE_INTERVAL = 5000;

export default class MessageManager {
  constructor({sender, peerManager, onChange}) {
    this.sender = sender;
    this.peerManager = peerManager;
    this.messages = new Map();
    this.onChange = onChange;
    this.messageStore = new MessageStore(sender);
    this.loadMessagesOnDisk();
    this.scheduleDiskWrite();
  }

  loadMessagesOnDisk = async () => {
    const messagesOnDisk = await this.messageStore.read();
    for (const message of messagesOnDisk) {
      this.messageReceived(message, false);
    }
  };

  scheduleDiskWrite = () => {
    setInterval(() => {
      this.messageStore.write(this.getRawMessages());
    }, DISK_WRITE_INTERVAL);
  };

  messageReceived = (message, doBroadcast = true) => {
    log(`Got ${message}`);
    const parsed = verifySignatureAndDecode(JSON.parse(message));
    if (!parsed) {
      log(`Could not verify signature, ignoring: ${message}`);
      return;
    }
    if (!verifyProofOfWork(parsed)) {
      log(`Could not verify proof of work, ignoring: ${message}`);
      return;
    }
    log(`Received and accepted message ${message}`);
    switch (parsed.type) {
      case Message.type.TEXT:
      case Message.type.COMMENT:
        if (!this.messages.has(parsed.messageId)) {
          this.messages.set(parsed.messageId, {parsed, message});
          this.onChange(this.messages);
          if (doBroadcast) {
            this.peerManager.broadcast(message);
          }
        }
        break;
      case Message.type.REBROADCAST:
        this.rebroadcast();
        break;
      default:
        log(`unrecognized message type ${parsed.type}`);
    }
  };

  postMessage = (text, topics) => {
    this.messageReceived(JSON.stringify(Message.createText(this.sender, text, topics)));
  };

  postComment = (messageId, text) => {
    this.messageReceived(JSON.stringify(Message.createComment(this.sender, messageId, text)));
  };

  rebroadcast = () => {
    log('rebroadcasting');
    for (const item of this.messages.values()) {
      const { message } = item;
      this.peerManager.broadcast(message);
    }
  };

  getRawMessages = () => {
    return toList(this.messages.values()).map(({message}) => message);
  };

  getFeedMessages = () => {
    const messages = this.messages;
    const feedMessages = toList(messages.values())
      .map(({parsed}) => parsed)
      .filter(message => message.type === Message.type.TEXT);
    const comments = toList(messages.values())
      .map(({parsed}) => parsed)
      .filter(message => message.type === Message.type.COMMENT);
    const messageComments = new Map();
    for (const comment of comments) {
      const current = messageComments.get(comment.reMessageId) || [];
      messageComments.set(comment.reMessageId, [...current, comment]);
    }
    return feedMessages.map(message => ({
      ...message,
      comments: messageComments.get(message.messageId) || [],
    }));
  };

}