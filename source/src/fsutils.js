import electron from 'electron';
import path from 'path';
import fs from 'fs';

const appPath = () => (electron.app || electron.remote.app).getPath('userData');

const fullPath = (filename) => path.join(appPath(), filename);

export const readFile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fullPath(filename), (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

export const writeFile = (filename, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(fullPath(filename), data, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};