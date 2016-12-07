import test from 'ava';
import supertest from 'supertest-as-promised';
import { config } from 'clipbeard';
// import User from '../../src/models/account';
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
/*
// signin fail
test('api: auth: /signin fail', async t => {

  const url = `${prefix}/auth/signin`;
  const req = request
   .post(url)
    .send({email: 'user_unknown@example.com', password: '12345'})
    .expect(401);

  const { body } = await req;

  t.is(body.success, false);
});

// signin
test('api: auth: /signin', async t => {

  const url = `${prefix}/auth/signin`;
  const req = request
   .post(url)
    .send({email: 'user_test@example.com', password: '123'})
    .expect(200);

  const { body } = await req;

  t.is(body.success, true);
});
*/
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

test('api: auth: /signup double', async t => {

  const url = `${prefix}/auth/signup`;
  const req = request
   .post(url)
    .send({email: 'user_test@example.com', password: '123'})
    .expect(200);

  // email, created_at, updated_at пока лежит и avatar
  const { body } = await req;

  t.is(body.email, 'user_test@example.com');
  t.is(body.provider, 'local');
});

// signup user exists

/* test('api: auth: /signup user exists', async t => {
  const user = await User.findOne({email: 'user_test@example.com'});
  t.is(user.email, 'user2_test@example.com');

 const url = `${prefix}/auth/signup`;
  const req = request
   .post(url)
    .send({email: 'user_test@example.com', password: '123'})
    .expect(200);
  // email, created_at, updated_at пока лежит и avatar
  const { body } = await req;
  t.is(body.email, '');
  t.is(body.provider, '');
  t.is(body.password, '');
}); */

test('api: auth: /signin', async t => {
  const user = {
    email: 'user_test@example.com',
    password: '123'
  };
  const url = `${prefix}/auth/signin`;
  const req = request
   .post(url)
    .send(user)
    .expect(200);
  console.log('----from test-------' + JSON.stringify(user));
  const { body } = await req;

  t.is(body.user.email, 'user_test@example.com');
});

test('api: auth: /logout', async t => {

  const url = `${prefix}/auth/logout`;
  const req = request
    .get(url)
    .expect(200);

  const { body } = await req;

  t.is(body.success, true);
});
