#!/bin/bash

mkdir -p release
./node_modules/electron-packager/bin/electron-packager.js ./ --no-prune --overwrite --all --out release