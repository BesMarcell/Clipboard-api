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
  } catch (err) {
    return ctx.jsonThrow(500, { error: err.message });
  }
});

router.get('clipboards', isAuthenticated, async ctx => {
  try {
    const result = await Clipboard.find({ account: ctx.session.passport.user }).populate('account', 'email');
    ctx.body = result;
  } catch (err) {
    return ctx.jsonThrow(500, { error: 'Internal server error' });
  }
});

router.get('clipboard/:clipboardId', isAuthenticated, async ctx => {
  try {
    const result = await Clipboard.findById(ctx.params.clipboardId).populate('account', 'email');
    ctx.body = result;
  } catch (err) {
    return ctx.jsonThrow(500, { error: 'Internal server error' });
  }
});

router.del('clipboard/:clipboardId', isAuthenticated, async ctx => {
  try {
    const result = await Clipboard.findById(ctx.params.clipboardId);
    await result.remove();
    ctx.body = result;
  } catch (err) {
    return ctx.jsonThrow(404, { error: 'Clipboard does not found' });
  }
});

router.put('clipboard/:clipboardId', isAuthenticated, async ctx => {
  try {
    const clipboard = await Clipboard.findById(ctx.params.clipboardId);
    clipboard.value = ctx.request.body.value;
    clipboard.type = ctx.request.body.type;
    await clipboard.save();
    ctx.body = clipboard;
  } catch (err) {
    return ctx.jsonThrow(500, { error: 'Internal server error' });
  }
});

export default router;
