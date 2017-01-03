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
    return ctx.body;
  } catch (err) {
    return ctx.jsonThrow(400, { error: String(err) });
  }
});

router.get('clipboards', async ctx => {
  try {
    const result = await Clipboard.find().populate('account', 'email');
    ctx.body = result;
    return ctx.body;
  } catch (err) {
    return ctx.jsonThrow(400, { error: 'something wrong' });
  }
});

router.get('clipboard/:clipboardId', async ctx => {
  try {
    const result = await Clipboard.findById(ctx.params.clipboardId).populate('account', 'email');
    ctx.body = result;
    return ctx.body;
  } catch (err) {
    return ctx.jsonThrow(400, { error: 'something wrong' });
  }
});

router.del('clipboard/:clipboardId', async ctx => {
  try {
    const result = await Clipboard.findById(ctx.params.clipboardId);
    await result.remove();
    ctx.body = result;
    return ctx.body;
  } catch (err) {
    return ctx.jsonThrow(400, { error: 'unknown clipboard' });
  }
});

router.put('clipboard/:clipboardId', async ctx => {
  try {
    const clipboard = ctx.body;
    await clipboard.save();
    return ctx.body;
  } catch (err) {
    return ctx.jsonThrow(400, { error: 'something wrong' });
  }
});

export default router;
