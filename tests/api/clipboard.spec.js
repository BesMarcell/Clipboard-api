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

test('api: auth: /clipboard - SUCCESS new data saved', async t => {
  const url = `${prefix}/clipboard`;
  const req = request
   .post(url)
   .send({value: 'any text', type: 'text'})
   .expect(200);

  const { body } = await req;
  t.is(body.value, 'any text');
});
