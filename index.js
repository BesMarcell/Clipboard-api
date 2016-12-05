const Promise = require('bluebird');
const path = require('path');
const util = require('util');
require('colors');

const checkClipbeardCommon = function() {
  console.log(`${'[~]'.cyan} Check is clipbeard common modules linked...`);

  return new Promise(function (resolve, reject) {
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

const linkClipboardCommon = function(isLinked) {
  return new Promise(function (resolve, reject) {
    if (isLinked) {
      console.log(`${'[+]'.green} Clipbeard common modules is linked`);
      return resolve();
    }

    console.log(`${'[-]'.red} Clipbeard common modules does not linked`);
    console.log(`${'[~]'.cyan} Linking clipbeard modules...`);
    const npm = require('npm');

    npm.load({}, function(err) {

      if (err) {
        return reject(err);
      }

      // clipbeard-common should link itself
      const clipbeardPath = path.resolve('./../clipbeard-common');
      npm.commands.link(clipbeardPath, function(err) {

        if (err) {
          return reject(err);
        }

        npm.commands.link('clipbeard', function(err) {

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


const appPromise = checkClipbeardCommon()
  .then(linkClipboardCommon)
  .then(function() {
    console.log(`${'[~]'.cyan} Run the server...`);
    require('babel-core/register');
    const app = require('./src');
    return new Promise((resolve) => resolve(app));
  })
  .catch((err) => {
    console.error(err);
  });

module.exports = appPromise;
