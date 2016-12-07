import koaRouter from 'koa-router';
// import passport from 'koa-passport';
import passport from '../utils/auth';

import User from '../models/account';

const router = koaRouter();

router.get('/', async ctx => {
  ctx.body = 'Auth namespace';
});

router.get('/logout', async ctx => {
  ctx.body = { success: true };
  ctx.logout();
});

router.post('/signin', async (ctx, next) => {
  try {
    const user = await passport.authenticate('local');
    ctx.login(user);
    if (ctx.isAuthenticated()) {
      ctx.body = { success: true };
    } else {
      ctx.body = { success: false};
    }
  } catch (err) {
    next(err);
  }
});

router.post('/signup', async (ctx, next) => {
  const user = new User(ctx.request.body);
  user.provider = 'local';
  try {
    const result = await user.save();
    ctx.body = result;
    // await ctx.login(user);
  } catch (err) {
    next(err);
  }
});

export default router;
