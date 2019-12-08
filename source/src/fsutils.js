import electron from 'electron';
import path from 'path';
import fs from 'fs';
import { createLogger, hashDigest } from './util';

const log = createLogger('fsutils');

export const appPath = () => (electron.app || electron.remote.app).getPath('userData');

export const fullPath = (filename) => path.join(appPath(), filename);

const getMediaTypeExtension = (filename) => {
  const parts = filename.split(".");
  return parts[parts.length - 1];
};

export const stableMediaFilename = (filename, contents) => {
  const ext = getMediaTypeExtension(filename);
  return `${hashDigest(contents)}.${ext}`;
};

export const readFile = (filename) => {
  log(`reading ${filename}`);
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

export const readAppFile = (filename) => {
  return readFile(fullPath(filename));
};

export const writeFile = (filename, data) => {
  log(`writing ${filename}`);
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, data, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const writeAppFile = (filename, data) => {
  return writeFile(fullPath(filename), data);
};
