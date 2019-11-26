import { readAppFile, writeAppFile, readFile, writeFile } from './fsutils';

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
      importedFile: '/home/enes/.config/electrate/config.json',
    };
  }

  setImportedfile = (val) =>{
    this.state['importedFile'] = val;
  }

  loadFile = async () => {
    const data = await readFile(this.state['importedFile']);
    this.data = JSON.parse(data);
    console.log(data);
  };

  importFile = (path) => {
    this.setImportedfile(path);
    this.loadFile();
  };

  get = (key) => {
    return this.data[key];
  };

  set = (key, val) => {
    this.data[key] = val;
    writeFile(this.state['importedFile'], JSON.stringify(this.data));
  }
}
