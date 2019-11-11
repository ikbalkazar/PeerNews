import { readFile, writeFile } from './fsutils';
import { createLogger } from './util';

const FILENAME = 'messages.json';

const log = createLogger('MessageStore');

export default class MessageStore {
  constructor(sender) {
    this.filename = `${sender.name}-messages.json`;
  }

  read = async () => {
    log(`reading ${this.filename}`);
    const data = await readFile(this.filename);
    log(`read ${data}`);
    return JSON.parse(data).messages;
  };

  write = async (messages) => {
    log(`writing ${messages}`);
    return writeFile(this.filename, JSON.stringify({messages}));
  };
}
