import WebTorrent from 'webtorrent';
import { createLogger } from './util';
import { readFile } from './fsutils';
import ConfigStore from './ConfigStore';

const log = createLogger('TorrentManager');


export default class TorrentManager {
  constructor() {
    this.configStore = new ConfigStore();
    this.torrents = this.configStore.get('torrent');
    this.client = new WebTorrent();
    log(`torrents ${this.client.torrents.length}`);
    /*setInterval(() => {
      log(`upload speed ${this.client.uploadSpeed}, download speed ${this.client.downloadSpeed}`);
      log(`progress ${this.client.progress}, ratio ${this.client.ratio}`);
    }, 3000);*/
  }

  addCompleteTorrent = (magnetURI, mediaURL) => {
    log(`adding to cache: ${mediaURL}`);
    this.torrents[magnetURI] = mediaURL;
    this.configStore.set('torrent', this.torrents);
  };

  download = (magnetURI, onMediaURL) => {
    log(`downloading ${magnetURI}`);
    if (this.torrents.hasOwnProperty(magnetURI)) {
      log(`already found in cache`);
      const mediaURL = this.torrents[magnetURI];
      onMediaURL(mediaURL);
      // start seeding instead
      this.seed(mediaURL, (newMagnetURI) => {
        if (newMagnetURI !== magnetURI) {
          log(`magnetURI mismatch when re-seeding ${magnetURI} ${newMagnetURI}`);
        }
      });
      return;
    }
    this.client.add(magnetURI, (torrent) => {
      log(`received torrent obj for download`);
      torrent.on('done', () => {
        const file = torrent.files[0];
        const filePath = `${torrent.path}/${file.path}`;
        log(`downloaded at ${filePath}`);
        this.addCompleteTorrent(magnetURI, filePath);
        onMediaURL(filePath);
      });
      torrent.on('error', (err) => {
        log(`error downloading ${err}`);
      })
    });
  };

  seed = async (filePath, onMagnetURI) => {
    log(`seeding ${filePath}`);
    const contents = await readFile(filePath);
    const buf = new Buffer(contents);
    const pathParts = filePath.split('/');
    buf.name = pathParts[pathParts.length - 1];
    log(`torrents ${this.client.torrents.length}`);
    const torrent = this.client.seed(buf, (torrent) => {
      log(`created torrent with magnet uri ${torrent.magnetURI}`);
      const torrentFilePath = `${torrent.path}/${torrent.files[0].path}`;
      this.addCompleteTorrent(torrent.magnetURI, torrentFilePath);
      onMagnetURI(torrent.magnetURI);
      torrent.on('ready', () => {
        log('seeding ready');
      });
    });
    torrent.on('error', (err) => {
      log(`error seeding ${filePath} with err ${err}`);
    });
  }
}