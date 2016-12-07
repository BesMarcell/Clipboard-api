import test from 'ava';
import supertest from 'supertest-as-promised';
import { config } from 'clipbeard';

import appPromise from './../../index';
import clearDb from './../utils/clear-db';

let request;
const prefix = config.get('server:api:prefix');

test.before(async t => {
  try {
    await clearDb;
    const app = await appPromise;
    request = supertest.agent(app.default.listen());
  } catch (err) {
    t.fail(err);
  }
});

test('api: main: /', async t => {

  const url = `${prefix}/`;
  const req = request
    .get(url)
    .expect(200);

  const { body } = await req;

  t.truthy(body.serverUnixTime, 'Should contains serverUnixTime property');
  t.truthy(body.serverUnixTime, 'Should contains serverTime propery');
  t.is(body.api.prefix, prefix, 'Should has correct prefix');
});

test('api: main: /test', async t => {

  const url = `${prefix}/test`;
  const req = request
    .get(url)
    .expect(200);

  const { body } = await req;

  t.is(body.message, 'test route');
  t.pass();
});

test('api: auth: /signin fail', async t => {

  const url = `${prefix}/auth/signin`;
  const req = request
   .post(url)
    .send({email: 'user_unknown@example.com', password: '1234'})
    .expect(200);

  const { body } = await req;

  t.is(body.success, false);
});

test('api: auth: /signup', async t => {

  const url = `${prefix}/auth/signup`;
  const req = request
   .post(url)
    .send({email: 'user_test@example.com', password: '123'})
    .expect(200);

  // email, created_at, updated_at пока лежит и avatar
  const { body } = await req;
  body.password = '';

  t.is(body.email, 'user_test@example.com');
  t.is(body.provider, 'local');
  t.is(body.password, '');
});

test('api: auth: /signin', async t => {

  const url = `${prefix}/auth/signin`;
  const req = request
   .post(url)
    .send({email: 'user_test@example.com', password: '123'})
    .expect(200);

  const { body } = await req;

  t.is(body.success, true);
});

test('api: auth: /logout', async t => {

  const url = `${prefix}/auth/logout`;
  const req = request
    .get(url)
    .expect(200);

  const { body } = await req;

  t.is(body.success, true);
});
