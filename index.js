const Promise = require('bluebird');
const path = require('path');
const util = require('util');
require('colors');

const checkClipbeardCommon = () => {
  console.log(`${'[~]'.cyan} Check is clipbeard common modules linked...`);

  return new Promise((resolve, reject) => {
    try {
      require('clipbeard');
      resolve(true);
    } catch (err) {
      if (err.message === 'Cannot find module \'clipbeard\'') {
        resolve(false);
      }
      resolve(true);
    }
  });
};

const linkClipboardCommon = (isLinked) => {
  return new Promise((resolve, reject) => {
    if (isLinked) {
      console.log(`${'[+]'.green} Clipbeard common modules is linked`);
      return resolve();
    }

    console.log(`${'[-]'.red} Clipbeard common modules does not linked`);
    console.log(`${'[~]'.cyan} Linking clipbeard modules...`);
    const npm = require('npm');

    npm.load({}, (err) => {

      if (err) {
        return reject(err);
      }

      // clipbeard-common should link itself
      const clipbeardPath = path.resolve('./../clipbeard-common');
      npm.commands.link(clipbeardPath, (err) => {

        if (err) {
          return reject(err);
        }

        npm.commands.link('clipbeard', (err) => {

          if (err) {
            return reject(err);
          }

          require('clipbeard');
          console.log(`${'[+]'.green} Clipbeard common modules is linked`);

          resolve();
        });
      });
    });
  });
};


checkClipbeardCommon()
  .then(linkClipboardCommon)
  .then(() => {
    console.log(`${'[~]'.cyan} Run the server...`);
    require('babel-core/register');
    require('./src');
  })
  .catch((err) => {
    console.error(err);
  });
