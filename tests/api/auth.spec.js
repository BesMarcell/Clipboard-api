import test from 'ava';
import supertest from 'supertest-as-promised';
import { config } from 'clipbeard';
import appPromise from './../../index';
import clearDb from './../utils/clear-db';
import createAccount from './../utils/create-account';

let request;
const prefix = config.get('server:api:prefix');

test.before(async t => {
  try {
    const app = await appPromise;
    await clearDb();
    await createAccount();
    request = supertest.agent(app.default.listen());
  } catch (err) {
    t.fail(err);
  }
});

test('api: auth: /signup - SUCCESS registration new account', async t => {

  const url = `${prefix}/auth/signup`;
  const req = request
   .post(url)
    .send({email: 'account_test@example.com', password: '123456'})
    .expect(200);

  const { body } = await req;
  t.is(body.email, 'account_test@example.com');
});

test('api: auth: /signup - SUCCESS registration new account2 (email with spaces. use trim)', async t => {

  const url = `${prefix}/auth/signup`;
  const req = request
   .post(url)
    .send({email: '  account_test2@example.com   ', password: '123456789'})
    .expect(200);

  const { body } = await req;
  t.is(body.email, 'account_test2@example.com');
});

test('api: auth: /signup - FAIL registration new account : too short password ', async t => {

  const url = `${prefix}/auth/signup`;
  const req = request
   .post(url)
    .send({email: 'account_test3@example.com', password: '123'})
    .expect(400);

  const { body } = await req;
  t.is(body.errors[0].msg, 'Password must be longer then 5 chars');
});

test('api: auth: /signup - FAIL registration new account : unformat email entered ', async t => {

  const url = `${prefix}/auth/signup`;
  const req = request
   .post(url)
    .send({email: 'account_testexample.com', password: '1234'})
    .expect(400);

  const { body } = await req;
  t.is(body.errors[0].msg, 'Invalid Email');
  t.is(body.errors[1].msg, 'Password must be longer then 5 chars');
});

test('api: auth: /signup - FAIL registration new account : no email entered ', async t => {

  const url = `${prefix}/auth/signup`;
  const req = request
   .post(url)
    .send({ password: '123' })
    .expect(400);

  const { body } = await req;
  t.is(body.errors[0].param, 'email');
  t.is(body.errors[0].msg, 'Invalid param');
  t.is(body.errors[1].msg, 'Invalid Email');
});

test('api: auth: /signup - FAIL registration new account : double registration', async t => {
  const url = `${prefix}/auth/signup`;
  const req = request
   .post(url)
    .send({ email: 'initial-account@example.com', password: '12345678' })
    .expect(400, JSON.stringify({ error: 'email exists' }));

  const { body } = await req;
  t.is(body.error, 'email exists');
});

test('api: auth: /signin - SUCCESS login', async t => {
  const accountTrue = {
    email: 'initial-account@example.com',
    password: '1234567'
  };
  const url = `${prefix}/auth/signin`;
  const req = request
   .post(url)
    .send(accountTrue)
    .expect(200);
  const { body } = await req;
  t.is(body.email, 'initial-account@example.com');
});

test('api: auth: /signin - FAIL login: account - unknown', async t => {
  const accountFail = {
    email: 'account_unknown@example.com',
    password: '12345678'
  };
  const url = `${prefix}/auth/signin`;
  const req = request
   .post(url)
    .send(accountFail)
    .expect(401, JSON.stringify({ error: 'Incorrect email and password' }));

  const { body } = await req;
  t.is(body.error, 'Incorrect email and password');
});

test('api: auth: /signin - FAIL login: password is fail', async t => {
  const accountFail = {
    email: 'initial-account@example.com',
    password: '12345678'
  };
  const url = `${prefix}/auth/signin`;
  const req = request
   .post(url)
    .send(accountFail)
    .expect(401);

  const { body } = await req;
  t.is(body.error, 'Incorrect email and password');
});

test('api: auth: /signin - FAIL login: password is shorter then 5 chatacters', async t => {
  const accountFail = {
    email: 'initial-account@example.com',
    password: '123'
  };
  const url = `${prefix}/auth/signin`;
  const req = request
   .post(url)
    .send(accountFail)
    .expect(401);

  const { body } = await req;
  t.is(body.errors[0].msg, 'Password must be longer then 5 chars');
});

test('api: auth: /signin - FAIL login: empty password', async t => {
  const accountFail = {
    email: 'initial-account@example.com'
  };
  const url = `${prefix}/auth/signin`;
  const req = request
   .post(url)
    .send(accountFail)
    .expect(401);

  const { body } = await req;
  t.is(body.errors[0].param, 'password');
  t.is(body.errors[0].msg, 'Invalid param');
  t.is(body.errors[1].msg, 'Password must be longer then 5 chars');
});

test('api: auth: /logout - SUCCESS logout', async t => {

  const url = `${prefix}/auth/logout`;
  const req = request
    .get(url)
    .expect(200);

  const { body } = await req;

  t.is(body.success, true);
});
