import test from 'ava';
import supertest from 'supertest-as-promised';
import { config } from 'clipbeard';
import Clipboard from '../../src/models/clipboard';
import appPromise from './../../index';
import clearDb from './../utils/clear-db';
import createAccount from './../utils/create-account';
import createClipboard from './../utils/create-clipboard';

let request;
const prefix = config.get('server:api:prefix');

test.before(async t => {
  try {
    const app = await appPromise;
    await clearDb();
    await createAccount();
    await createClipboard();
    await createClipboard();
    request = supertest.agent(app.default.listen());
  } catch (err) {
    t.fail(err);
  }
});

test.beforeEach(async t => {
  try {
    const accountTrue = {
      email: 'initial-account@example.com',
      password: '1234567'
    };
    const url = `${prefix}/auth/signin`;
    const req = request
     .post(url)
      .send(accountTrue)
      .expect(200);
    await req;
  } catch (err) {
    t.fail(err);
  }
});

test('/clipboard - SUCCESS new data saved', async t => {
  const url = `${prefix}/clipboard`;
  const req = request
   .post(url)
   .send({value: 'any text', type: 'text'})
   .expect(200);

  const { body } = await req;
  t.is(body.value, 'any text');
});

test('/clipboard - FAIL new data save. Value is not in type ENUM', async t => {
  const url = `${prefix}/clipboard`;
  const req = request
   .post(url)
   .send({value: 'any text', type: 'song'})
   .expect(500);

  const { body } = await req;
  t.is(body.error, 'Clipboard validation failed');
});

test('/clipboard - FAIL new data save. Empty TYPE', async t => {
  const url = `${prefix}/clipboard`;
  const req = request
   .post(url)
   .send({value: 'any text'})
   .expect(500);

  const { body } = await req;
  t.is(body.error, 'Clipboard validation failed');
});

test('/clipboard - FAIL new data save. Empty VALUE', async t => {
  const url = `${prefix}/clipboard`;
  const req = request
   .post(url)
   .send({type: 'text'})
   .expect(500);

  const { body } = await req;
  t.is(body.error, 'Clipboard validation failed');
});

test('/clipboard/_id - SUCCESS receive clipboard by id', async t => {
  const result = await Clipboard.find();
  const url = `${prefix}/clipboard/${result[0]._id}`;
  const req = request
    .get(url)
    .expect(200);

  const {body} = await req;
  t.is(body.value, 'any text');
});

test('/clipboard/_id - SUCCESS delete clipboard by id', async () => {
  const result = await Clipboard.find();

  const url = `${prefix}/clipboard/${result[0]._id}`;
  const req = request
  .del(url)
  .expect(200);

  await req;
});

test('/clipboard/_id - FAIL delete - Unknown id', async t => {

  const url = `${prefix}/clipboard/123`;
  const req = request
    .del(url)
    .expect(404);

  const { body } = await req;
  t.is(body.error, 'Clipboard does not found');

});

test('/clipboard/_id - SUCCESS update ', async t => {

  const result = await Clipboard.find();

  const url = `${prefix}/clipboard/${result[0]._id}`;
  const req = request
    .put(url)
    .send({ value: 'new text', type: 'text' })
    .expect(200);

  const { body } = await req;
  t.is(body.value, 'new text');

});
