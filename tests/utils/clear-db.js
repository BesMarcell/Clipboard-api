import Promise from 'bluebird';
import db from './../../src/db';

export default () => {
  const promise = new Promise((resolve, reject) => {

    db.connection.on('open', () => {
      db.connection.db.dropDatabase(err => {
        if (err) {
          return reject(err);
        }

        console.log('resolve clearDb');
        resolve();
      });
    });
  });
  return promise;
};
