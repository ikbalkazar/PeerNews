import { verifyProofOfWork, verifySignatureAndDecode, toList, createLogger, isTorrent } from './util';
import * as Message from './message';
import MessageStore from './MessageStore';

const log = createLogger('MessageManager');

const DISK_WRITE_INTERVAL = 5000;

export default class MessageManager {
  constructor({sender, peerManager, torrentManager, onChange}) {
    this.sender = sender;
    this.peerManager = peerManager;
    this.torrentManager = torrentManager;
    this.messages = new Map();
    this.torrentMedia = new Map();
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

  processTorrentIfNeeded = (message) => {
    if (!message.media) {
      return;
    }
    if (isTorrent(message.media)) {
      this.torrentManager.download(message.media, (mediaURL) => {
        this.torrentMedia.set(message.messageId, mediaURL);
        this.onChange(this.messages);
      });
    }
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
      case Message.type.VOTE:
        if (!this.messages.has(parsed.messageId)) {
          this.messages.set(parsed.messageId, {parsed, message});
          this.processTorrentIfNeeded(parsed);
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

  postMessage = (title, media, text, topics) => {
    this.messageReceived(JSON.stringify(Message.createPost(this.sender, title, media, text, topics)));
  };

  postComment = (messageId, text) => {
    this.messageReceived(JSON.stringify(Message.createComment(this.sender, messageId, text)));
  };

  upvote = (messageId) => {
    this.messageReceived(JSON.stringify(Message.createVote(this.sender, messageId, 1)));
  };

  downvote = (messageId) => {
    this.messageReceived(JSON.stringify(Message.createVote(this.sender, messageId, -1)));
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

  getMessageMedia = (messageId, media) => {
    if (!media) {
      return null;
    }
    if (!isTorrent(media)) {
      return media;
    }
    return this.torrentMedia.get(messageId);
  };

  getAllMessages = () => {
    const messages = this.messages;
    const parsedMessages = toList(messages.values()).map(({parsed}) => parsed);
    const groupByReMessageId = (subMessages) => {
      const result = new Map();
      for (const subMessage of subMessages) {
        const current = result.get(subMessage.reMessageId) || [];
        result.set(subMessage.reMessageId, [...current, subMessage]);
      }
      return result;
    };
    const feedMessages = parsedMessages.filter(x => x.type === Message.type.TEXT);
    const comments = groupByReMessageId(parsedMessages.filter(x => x.type === Message.type.COMMENT));
    const votes = groupByReMessageId(parsedMessages.filter(x => x.type === Message.type.VOTE));
    return feedMessages.map(message => ({
      ...message,
      comments: comments.get(message.messageId) || [],
      votes: votes.get(message.messageId) || [],
      media: this.getMessageMedia(message.messageId, message.media),
    }));
  };

  getFeedMessages = () => {
    const messages = this.messages;
    const parsedMessages = toList(messages.values()).map(({parsed}) => parsed);
    const groupByReMessageId = (subMessages) => {
      const result = new Map();
      for (const subMessage of subMessages) {
        const current = result.get(subMessage.reMessageId) || [];
        result.set(subMessage.reMessageId, [...current, subMessage]);
      }
      return result;
    };
    const feedMessages = parsedMessages.filter(x => x.type === Message.type.TEXT);
    const comments = groupByReMessageId(parsedMessages.filter(x => x.type === Message.type.COMMENT));
    const votes = groupByReMessageId(parsedMessages.filter(x => x.type === Message.type.VOTE));
    return feedMessages.map(message => ({
      ...message,
      comments: comments.get(message.messageId) || [],
      votes: votes.get(message.messageId) || [],
      media: this.getMessageMedia(message.messageId, message.media),
    }));
  };


  getFilteredMessagesByTopic = (topic) => {
      const messages = this.messages;
      const unFilteredParsedMessages = toList(messages.values()).map(({parsed}) => parsed);
      const parsedMessages = unFilteredParsedMessages.map( message => {
          if( message.type === Message.type.TEXT || message.type === Message.type.FILTERED ){
            let indicator = false;
            for( var j = 0; j < message.topics.length; j++ ) {
              console.log( message.topics[j] );
              if (topic.label === message.topics[j])
                indicator = true;
            }

            if( indicator === true ){
              let newMessage = message;
              newMessage.type = Message.type.TEXT;
              return( message );
            }
            else{
              let newMessage = message;
              newMessage.type = Message.type.FILTERED;
              return( newMessage );
            }
          }
          else{
            return( message );
          }
       });
      const groupByReMessageId = (subMessages) => {
          const result = new Map();
          for (const subMessage of subMessages) {
            const current = result.get(subMessage.reMessageId) || [];
            result.set(subMessage.reMessageId, [...current, subMessage]);
          }
          return result;
      };
      const globalMessages = parsedMessages.filter(x => x.type === Message.type.TEXT);
      const comments = groupByReMessageId(parsedMessages.filter(x => x.type === Message.type.COMMENT));
      const votes = groupByReMessageId(parsedMessages.filter(x => x.type === Message.type.VOTE));
      return globalMessages.map(message => ({
          ...message,
          comments: comments.get(message.messageId) || [],
          votes: votes.get(message.messageId) || [],
          media: this.getMessageMedia(message.messageId, message.media),
      }));
  };

}