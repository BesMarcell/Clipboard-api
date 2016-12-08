import test from 'ava';
import supertest from 'supertest-as-promised';
import { config } from 'clipbeard';
import appPromise from './../../index';
import clearDb from './../utils/clear-db';
import createUser from './../utils/create-user';

let request;
let user;
const prefix = config.get('server:api:prefix');

test.before(async t => {
  try {
    const app = await appPromise;
    console.log('asdasd');
    await clearDb();
    user = await createUser();
    request = supertest.agent(app.default.listen());
  } catch (err) {
    t.fail(err);
  }
});

test('api: auth: /signup', async t => {

  const url = `${prefix}/auth/signup`;
  const req = request
   .post(url)
    .send({email: 'user_test@example.com', password: '123'})
    .expect(200);

  const { body } = await req;
  body.password = '';

  t.is(body.email, 'user_test@example.com');
  t.is(body.provider, 'local');
  t.is(body.password, '');
});

test('api: auth: /signup double registration must be fail', async () => {

  const url = `${prefix}/auth/signup`;
  const req = request
   .post(url)
    .send({email: 'initial-user@example.com', password: '12345'})
    .expect(401);

  await req;
});

test('ap  i: auth: /signin', async t => {
  const url = `${prefix}/auth/signin`;
  const req = request
   .post(url)
    .send(user)
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

// signin fail for user_unknown
test('api: auth: /signin fail for user_unknown', async () => {
  const userFail = {
    email: 'user_unknown@example.com',
    password: '123'
  };
  const url = `${prefix}/auth/signin`;
  const req = request
   .post(url)
    .send(userFail)
    .expect(401);

  await req;
});

// signin fail for uncorrect password
test('api: auth: /signin fail uncorrect password', async () => {
  const userFail = {
    email: 'initial-user@example.com',
    password: '123'
  };
  const url = `${prefix}/auth/signin`;
  const req = request
   .post(url)
    .send(userFail)
    .expect(401);

  await req;
});
