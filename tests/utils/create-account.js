import Promise from 'bluebird';
import Account from '../../src/models/account';

const newAccount = {
  email: 'initial-account@example.com',
  password: '1234567',
  provider: 'local'
};

export default () => {
  const createAccountPromise = new Promise(async (resolve, reject) => {

    try {
      const account = await new Account(newAccount).save();
      resolve(account);
    } catch (err) {
      reject(err);
    }

  });
  return createAccountPromise;
};
