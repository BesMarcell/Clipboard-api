import Promise from 'bluebird';
import Clipboard from '../../src/models/clipboard';

const newClipboard = {
  value: 'any text',
  type: 'text',
  account: '586b42eb09c5db165a0c2051'
};

export default () => {
  const createClipboardPromise = new Promise(async (resolve, reject) => {

    try {
      const account = await new Clipboard(newClipboard).save();
      resolve(account);
    } catch (err) {
      reject(err);
    }

  });
  return createClipboardPromise;
};
