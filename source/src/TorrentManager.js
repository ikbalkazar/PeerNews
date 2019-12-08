import WebTorrent from 'webtorrent';
import { createLogger } from './util';
import { readAppFile, writeAppFile, readFile, appPath } from './fsutils';

const log = createLogger('TorrentManager');

const CACHE_PATH = 'torrents.json';

export default class TorrentManager {
  constructor() {
    this.torrents = null;
    this.loadCache();
    this.client = new WebTorrent();
    log(`torrents ${this.client.torrents.length}`);
    log(JSON.stringify(this.torrents));
    /*setInterval(() => {
      log(`upload speed ${this.client.uploadSpeed}, download speed ${this.client.downloadSpeed}`);
      log(`progress ${this.client.progress}, ratio ${this.client.ratio}`);
    }, 3000);*/
  }

  loadCache = async () => {
    try {
      const contents = await readAppFile(CACHE_PATH);
      this.torrents = JSON.parse(contents);
    } catch (err) {
      log(err);
      this.torrents = {};
    }
  };

  addCompleteTorrent = async (magnetURI, mediaURL) => {
    log(`adding to cache: ${mediaURL}`);
    this.torrents[magnetURI] = mediaURL;
    await writeAppFile(CACHE_PATH, JSON.stringify(this.torrents));
  };

  download = async (magnetURI, onMediaURL) => {
    log(`downloading ${magnetURI}`);
    if (this.torrents === null) {
      await this.loadCache();
    }
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
    const opts = {
      path: appPath(),
    };
    this.client.add(magnetURI, opts, (torrent) => {
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
    if (this.torrents === null) {
      await this.loadCache();
    }
    const contents = await readFile(filePath);
    const buf = new Buffer(contents);
    const pathParts = filePath.split('/');
    buf.name = pathParts[pathParts.length - 1];
    log(`torrents ${this.client.torrents.length}`);
    const opts = {
      path: appPath(),
    };
    const torrent = this.client.seed(buf, opts, (torrent) => {
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