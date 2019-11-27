import { readAppFile, writeAppFile, readFile, writeFile } from './fsutils';

export default class ConfigStore {
  constructor() {
    this.data = {
      sender: null,
      torrent: {},
      followedTopics: [],
      followedUsers: [],
    };
  }

  load = async () => {
    try {
      const data = await readAppFile('config.json');
      this.data = JSON.parse(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  save = async () => {
    writeAppFile('config.json', JSON.stringify(this.data));
  };

  importFile = async (path) => {
    const data = await readFile(path);
    this.data = JSON.parse(data);
    await this.save();
  };

  get = (key) => {
    return this.data[key];
  };

  set = (key, val) => {
    this.data[key] = val;
    this.save();
  }
}
