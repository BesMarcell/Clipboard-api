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

router.post('clipboard', async (ctx, next) => {
  try {
    const info = ctx.request.body;
    // info.account = ctx.state.user._id;
    info.account = '5860fd4579d948a1100db92c';
    const clipboard = new Clipboard(info);
    const result = await clipboard.save();
    ctx.body = result;
  } catch (err) {
    next(err);
  }
});

export default router;
