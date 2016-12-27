import test from 'ava';
import supertest from 'supertest-as-promised';
import { config } from 'clipbeard';
import appPromise from './../../index';

let request;
const prefix = config.get('server:api:prefix');

test.before(async t => {
  try {
    const app = await appPromise;
    request = supertest.agent(app.default.listen());
  } catch (err) {
    t.fail(err);
  }
});

test('api: auth: /clipboard - SUCCESS new data saved', async t => {
  const accountTrue = {
    email: 'initial-account@example.com',
    password: '1234567'
  };
  const urlA = `${prefix}/auth/signin`;
  const reqA = request
   .post(urlA)
    .send(accountTrue)
    .expect(200);
  await reqA;

  const url = `${prefix}/clipboard`;
  const req = request
   .post(url)
   .send({value: 'any text', type: 'text'}, {withCredentials: true})
   .expect(200);

  const { body } = await req;
  t.is(body.value, 'any text');
});

test('api: auth: /clipboard - FAIL new data save not ib ENUM', async t => {
  const accountTrue = {
    email: 'initial-account@example.com',
    password: '1234567'
  };
  const urlA = `${prefix}/auth/signin`;
  const reqA = request
   .post(urlA)
    .send(accountTrue)
    .expect(200);
  await reqA;

  const url = `${prefix}/clipboard`;
  const req = request
   .post(url)
   .send({value: 'any text', type: 'song'}, {withCredentials: true})
   .expect(400);

  const { body } = await req;
  t.is(body.error, 'ValidationError: enum validator failed for path `type` with value `song`');
});
