import electron from 'electron';
import path from 'path';
import fs from 'fs';

const log = (message) => {
  console.log(`[FileStore] ${message}`);
};

const parseDataFile = (filePath, defaults) => {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch(error) {
    log(error);
    return defaults;
  }
};

export default class ConfigStore {
  constructor() {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    this.path = path.join(userDataPath, 'config.json');
    this.data = parseDataFile(this.path, {
      sender: null,
      name: null,
    });
  }

  get = (key) => {
    return this.data[key];
  };

  set = (key, val) => {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}
