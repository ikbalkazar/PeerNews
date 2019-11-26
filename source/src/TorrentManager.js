import WebTorrent from 'webtorrent';
import { createLogger } from './util';

const log = createLogger('TorrentManager');

export default class TorrentManager {
  constructor() {
    this.client = new WebTorrent();
  }

  download = (magnetURI, onMediaURL) => {
    log(`downloading ${magnetURI}`);
    this.client.add(magnetURI, (torrent) => {
      torrent.on('done', () => {
        const file = torrent.files[0];
        const filePath = `${torrent.path}/${file.path}`;
        log(`downloaded at ${filePath}`);
        onMediaURL(filePath);
      });
    });
  };

  seed = (filePath, onMagnetURI) => {
    log(`seeding ${filePath}`);
    this.client.seed(filePath, (torrent) => {
      log(`created torrent with magnet uri ${torrent.magnetURI}`);
      onMagnetURI(torrent.magnetURI);
    });
  }
}