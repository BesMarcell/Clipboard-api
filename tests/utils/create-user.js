import Promise from 'bluebird';
import Account from '../../src/models/account';

const newUser = {
  email: 'initial-user@example.com',
  password: '1234567',
  provider: 'local'
};

export default () => {
  const createUserPromise = new Promise(async (resolve, reject) => {

    try {
      const account = await new Account(newUser).save();
      resolve(account);
    } catch (err) {
      reject(err);
    }

  });
  return createUserPromise;
};
