import { readAppFile, writeAppFile } from './fsutils';

export default class ConfigStore {
  constructor() {
    this.data = {
      sender: null,
      name: null,
      torrent: {},
      followedTopics: [],
      followedUsers: [],
    };
    this.state = {
      importedFile: 'config.json',
    };
    this.loadFile();
  }

  loadFile = async () => {
    const data = await readAppFile(this.state.importedFile);
    this.data = JSON.parse(data);
  };

  importFile = (path) => {
    this.setState({importedFile:path});
    this.loadFile();
  };

  get = (key) => {
    return this.data[key];
  };

  set = (key, val) => {
    this.data[key] = val;
    writeAppFile(this.state.importedFile, JSON.stringify(this.data));
  }
}
