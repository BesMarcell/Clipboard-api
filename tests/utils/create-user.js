import Promise from 'bluebird';
import User from '../../src/models/account';

const newUser = {
  email: 'initial-user@example.com',
  password: '1234567',
  provider: 'local'
};

export default () => {
  const createUserPromise = new Promise(async (resolve, reject) => {

    try {
      const user = await new User(newUser).save();
      console.log('resolve create User');
      resolve(user);
    } catch (err) {
      reject(err);
    }

  });
  return createUserPromise;
};
