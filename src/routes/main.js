import koaRouter from 'koa-router';
import { config } from 'clipbeard';

const router = koaRouter();

router.get('/', async ctx => {

  const currentTime = Date.now();

  ctx.body = {
    serverUnixTime: currentTime,
    serverTime: new Date(currentTime),
    api: config.get('server:api')
  };
});

router.get('test', async ctx => {

  ctx.body = {
    message: 'test route'
  };
});

export default router;
