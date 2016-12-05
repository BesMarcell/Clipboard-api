import Promise from 'bluebird';
import db from './../../src/db';

const promise = new Promise((resolve, reject) => {

  db.connection.on('open', () => {
    db.connection.db.dropDatabase(err => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
});

export default promise;
