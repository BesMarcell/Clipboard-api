import koaRouter from 'koa-router';
import { config } from 'clipbeard';
import Clipboard from '../models/clipboard';

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

router.post('clipboard', async ctx => {
  try {
    const info = ctx.request.body;
    info.account = ctx.session.passport.user;
    const clipboard = new Clipboard(info);
    const result = await clipboard.save();
    ctx.body = result;
  } catch (err) {
    return ctx.jsonThrow(400, { error: String(err) });
  }
});

export default router;
