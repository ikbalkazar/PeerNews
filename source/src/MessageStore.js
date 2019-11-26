import { readAppFile, writeAppFile } from './fsutils';
import { createLogger } from './util';

const FILENAME = 'messages.json';

const log = createLogger('MessageStore');

export default class MessageStore {
  constructor(sender) {
    this.filename = `${sender.name}-messages.json`;
  }

  read = async () => {
    log(`reading ${this.filename}`);
    const data = await readAppFile(this.filename);
    log(`read ${data}`);
    return JSON.parse(data).messages;
  };

  write = async (messages) => {
    log(`writing ${messages}`);
    return writeAppFile(this.filename, JSON.stringify({messages}));
  };
}
