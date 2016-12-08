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
  await passport.authenticate('local', async (err, user, info, status) => {
    if (user === false) {
      ctx.body = { success: false };
      ctx.throw(401);
    } else {
      ctx.body = { success: true };
      return ctx.login(user);
    }
    console.log(err, user, info, status);
    ctx.body = user;
  })(ctx, next);
});

router.post('/signup', async (ctx, next) => {
  const user = new User(ctx.request.body);
  const userExists = await User.findOne({email: ctx.request.body.email});
  user.provider = 'local';
  if (!userExists) {
    try {
      const result = await user.save();
      ctx.body = result;
    } catch (err) {
      next(err);
    }
  } else {
    ctx.body = { success: false };
    ctx.throw(401);
  }
});

export default router;
