import { readAppFile, writeAppFile } from './fsutils';

const FILENAME = 'config.json';

export default class ConfigStore {
  constructor() {
    this.data = {
      sender: null,
      name: null,
    };
    this.loadFile();
  }

  loadFile = async () => {
    const data = await readAppFile(FILENAME);
    this.data = JSON.parse(data);
  };

  get = (key) => {
    return this.data[key];
  };

  set = (key, val) => {
    this.data[key] = val;
    writeAppFile(FILENAME, JSON.stringify(this.data));
  }
}
