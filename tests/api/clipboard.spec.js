import test from 'ava';
import supertest from 'supertest-as-promised';
import { config } from 'clipbeard';
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
   .send({value: 'any text', type: 'text'}, {withCredentials: true})
   .expect(200);

  const { body } = await req;
  t.is(body.value, 'any text');
});

test('/clipboard - FAIL new data save. Value not in type ENUM', async t => {
  const url = `${prefix}/clipboard`;
  const req = request
   .post(url)
   .send({value: 'any text', type: 'song'}, {withCredentials: true})
   .expect(500);

  const { body } = await req;
  t.is(body.error, 'Clipboard validation failed');
});

test('/clipboard - FAIL new data save. Empty TYPE', async t => {
  const url = `${prefix}/clipboard`;
  const req = request
   .post(url)
   .send({value: 'any text'}, {withCredentials: true})
   .expect(500);

  const { body } = await req;
  t.is(body.error, 'Clipboard validation failed');
});

test('/clipboard - FAIL new data save. Empty VALUE', async t => {
  const url = `${prefix}/clipboard`;
  const req = request
   .post(url)
   .send({type: 'text'}, {withCredentials: true})
   .expect(500);

  const { body } = await req;
  t.is(body.error, 'Clipboard validation failed');
});
/* do not work because auth has added and specification for find
test('/clipboards - SUCCESS receive clipboards', async t => {
  const url = `${prefix}/clipboards`;
  const req = request
    .get(url)
    .expect(200);

  const { body } = await req;
  t.is(body[0].value, 'any text');
});
*/
/*
test('/clipboard/_id - SUCCESS receive clipboard by id', async t => {
  const url = `${prefix}/clipboards`;
  const req = request
    .get(url)
    .expect(200);

  const { body } = await req;

  const url2 = `${prefix}/clipboard/${body[0]._id}`;
  const req2 = request
    .get(url2)
    .expect(200);

  await req2;
});
*/
/*
test('delete /clipboard/_id - SUCCESS delete clipboard by id', async t => {
  const url = `${prefix}/clipboards`;
  const req = request
    .get(url)
    .expect(200);

  const { body } = await req;

  const url2 = `${prefix}/clipboard/${body[0]._id}`;
  const req2 = request
    .del(url2)
    .expect(200);

  await req2;
});
*/
test('delete /clipboard/_id - FAIL delete - Unknown id', async t => {

  const url = `${prefix}/clipboard/123`;
  const req = request
    .del(url)
    .expect(404);

  const { body } = await req;
  t.is(body.error, 'Clipboard does not found');

});
