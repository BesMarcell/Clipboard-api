import Promise from 'bluebird';
import db from './../../src/db';

const promise = new Promise(resolve => {

  db.connection.on('open', () => {
    db.connection.db.dropDatabase();
    resolve();
  });
});

export default promise;
