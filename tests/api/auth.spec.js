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
    await clearDb();
    user = await createUser();
    request = supertest.agent(app.default.listen());
  } catch (err) {
    t.fail(err);
  }
});

test('api: auth: /signup - SUCCESS registration new user', async t => {

  const url = `${prefix}/auth/signup`;
  const req = request
   .post(url)
    .send({email: 'user_test@example.com', password: '123456'})
    .expect(200);

  const { body } = await req;
  t.is(body.user.email, 'user_test@example.com');
});

test('api: auth: /signup - SUCCESS registration new user2 (email with spaces. use trim)', async t => {

  const url = `${prefix}/auth/signup`;
  const req = request
   .post(url)
    .send({email: '  user_test2@example.com   ', password: '123456789'})
    .expect(200);

  const { body } = await req;
  t.is(body.user.email, 'user_test2@example.com');
});

test('api: auth: /signup - FAIL registration new user : too short password ', async t => {

  const url = `${prefix}/auth/signup`;
  const req = request
   .post(url)
    .send({email: 'user_test3@example.com', password: '123'})
    .expect(400);

  const { body } = await req;
  t.is(body.err[0].msg, 'Password must be longer then 5 chars');
});

test('api: auth: /signup - FAIL registration new user : unformat email entered ', async t => {

  const url = `${prefix}/auth/signup`;
  const req = request
   .post(url)
    .send({email: 'user_testexample.com', password: '1234'})
    .expect(400);

  const { body } = await req;
  t.is(body.err[0].msg, 'Invalid Email');
  t.is(body.err[1].msg, 'Password must be longer then 5 chars');
});

test('api: auth: /signup - FAIL registration new user : no email entered ', async t => {

  const url = `${prefix}/auth/signup`;
  const req = request
   .post(url)
    .send({ password: '123' })
    .expect(400);

  const { body } = await req;
  t.is(body.err[0].param, 'email');
  t.is(body.err[0].msg, 'Invalid param');
  t.is(body.err[1].msg, 'Invalid Email');
});

test('api: auth: /signup - FAIL registration new user : double registration', async () => {
  const url = `${prefix}/auth/signup`;
  const req = request
   .post(url)
    .send({ email: 'initial-user@example.com', password: '12345678' })
    .expect(400, 'Email exists');

  await req;
});

test('api: auth: /signin - SUCCESS login', async t => {
  const url = `${prefix}/auth/signin`;
  const req = request
   .post(url)
    .send(user)
    .expect(200);
  const { body } = await req;
  t.is(body.user.email, 'initial-user@example.com');
});

test('api: auth: /signin - FAIL login: user - unknown', async () => {
  const userFail = {
    email: 'user_unknown@example.com',
    password: '123456789'
  };
  const url = `${prefix}/auth/signin`;
  const req = request
   .post(url)
    .send(userFail)
    .expect(401, 'Incorrect email and password');

  await req;
});

test('api: auth: /signin - FAIL login: password is fail', async () => {
  const userFail = {
    email: 'initial-user@example.com',
    password: '12345678'
  };
  const url = `${prefix}/auth/signin`;
  const req = request
   .post(url)
    .send(userFail)
    .expect(401, 'Incorrect email and password');

  await req;
});

test('api: auth: /signin - FAIL login: password is shorter then 5 chatacters', async t => {
  const userFail = {
    email: 'initial-user@example.com',
    password: '123'
  };
  const url = `${prefix}/auth/signin`;
  const req = request
   .post(url)
    .send(userFail)
    .expect(401);

  const { body } = await req;
  t.is(body.err[0].msg, 'Password must be longer then 5 chars');
});

test('api: auth: /signin - FAIL login: empty password', async t => {
  const userFail = {
    email: 'initial-user@example.com'
  };
  const url = `${prefix}/auth/signin`;
  const req = request
   .post(url)
    .send(userFail)
    .expect(401);

  const { body } = await req;
  t.is(body.err[0].param, 'password');
  t.is(body.err[0].msg, 'Invalid param');
  t.is(body.err[1].msg, 'Password must be longer then 5 chars');
});

test('api: auth: /logout - SUCCESS logout', async t => {

  const url = `${prefix}/auth/logout`;
  const req = request
    .get(url)
    .expect(200);

  const { body } = await req;

  t.is(body.success, true);
});
