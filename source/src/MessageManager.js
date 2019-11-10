import { verifyProofOfWork, verifySignatureAndDecode } from './util';
import * as Message from './message';

const log = (message) => {
  console.log(`[MessageManager] ${message}`);
};

export default class MessageManager {
  constructor({sender, peerManager, onChange}) {
    this.sender = sender;
    this.peerManager = peerManager;
    this.messages = new Map();
    this.onChange = onChange;
  }

  messageReceived = (message) => {
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
          this.peerManager.broadcast(message);
        }
        break;
      case Message.type.REBROADCAST:
        this.rebroadcast();
        break;
      default:
        log(`unrecognized message type ${parsed.type}`);
    }
  };

  postMessage = (text) => {
    this.messageReceived(JSON.stringify(Message.createText(this.sender, text)));
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
}