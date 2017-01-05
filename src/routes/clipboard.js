import koaRouter from 'koa-router';
import Clipboard from '../models/clipboard';
import isAuthenticated from './../middleware/is-authenticated';

const router = koaRouter();

router.post('clipboard', isAuthenticated, async ctx => {
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

router.get('clipboards', isAuthenticated, async ctx => {
  try {
    const result = await Clipboard.find({ account: ctx.session.passport.user }).populate('account', 'email');
    ctx.body = result;
  } catch (err) {
    return ctx.jsonThrow(400, { error: 'something wrong' });
  }
});

router.get('clipboard/:clipboardId', isAuthenticated, async ctx => {
  try {
    const result = await Clipboard.findById(ctx.params.clipboardId).populate('account', 'email');
    ctx.body = result;
    return ctx.body;
  } catch (err) {
    return ctx.jsonThrow(400, { error: 'something wrong' });
  }
});

router.del('clipboard/:clipboardId', isAuthenticated, async ctx => {
  try {
    const result = await Clipboard.findById(ctx.params.clipboardId);
    await result.remove();
    ctx.body = result;
    return ctx.body;
  } catch (err) {
    return ctx.jsonThrow(400, { error: 'unknown clipboard' });
  }
});

router.put('clipboard/:clipboardId', isAuthenticated, async ctx => {
  try {
    const clipboard = ctx.body;
    await clipboard.save();
    return ctx.body;
  } catch (err) {
    return ctx.jsonThrow(400, { error: 'something wrong' });
  }
});

export default router;
