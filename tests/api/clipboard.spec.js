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
   .expect(400);

  const { body } = await req;
  t.is(body.error, 'ValidationError: enum validator failed for path `type` with value `song`');
});

test('/clipboard - FAIL new data save. Empty TYPE', async t => {
  const url = `${prefix}/clipboard`;
  const req = request
   .post(url)
   .send({value: 'any text'}, {withCredentials: true})
   .expect(400);

  const { body } = await req;
  t.is(body.error, 'ValidationError: Path `type` is required.');
});

test('/clipboard - FAIL new data save. Empty VALUE', async t => {
  const url = `${prefix}/clipboard`;
  const req = request
   .post(url)
   .send({type: 'text'}, {withCredentials: true})
   .expect(400);

  const { body } = await req;
  t.is(body.error, 'ValidationError: Path `value` is required.');
});
