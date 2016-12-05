import test from 'ava';
import supertest  from 'supertest-as-promised';
import appPromise from './../../index';
import { config } from 'clipbeard';

let request;
const prefix = config.get('server:api:prefix');

test.before(async t => {
  const app = await appPromise;
  request = supertest.agent(app.default.listen());
});

test('api: main: /', async t => {

  const url = `${prefix}/`;
  const req = request
    .get(url)
    .expect(200)

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
