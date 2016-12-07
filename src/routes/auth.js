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
  // тут приходит мой юзвер с емейлом и логином
  await passport.authenticate('local', async (err, user, info, status) => {
    console.log('This is sign in ---' + user);
    // there is some logic (show errors, user or something else)
    // code bellow - just EXAMPLE for show how call authenticate function correct
    /* console.log('This is sign in ---' + JSON.stringify(user));
    if (user === false) {
      ctx.body = { success: false };
      ctx.throw(401);
    } else {
      ctx.body = { success: true };
      return ctx.login(user);
    }
*/
    console.log(err, user, info, status);
    ctx.body = user;
  })(ctx, next);
});

router.post('/signup', async (ctx, next) => {
  const user = new User(ctx.request.body);
  // console.log('++++++++++++' + ctx.request.body.email);
  const flag = await User.findOne({email: ctx.request.body.email});
  // console.log('++++++++++++' + JSON.stringify(flag));
  user.provider = 'local';
  if (!flag) {
    console.log('we are in try');
    try {
      const result = await user.save();
      ctx.body = result;
    } catch (err) {
      next(err);
    }
  }
});

export default router;
