import koaRouter from 'koa-router';
import passport from '../utils/auth';
import { signupValidate, signinValidate, signinValidateErrors, signupValidateErrors } from '../utils/auth.validate';
import Account from '../models/account';

const router = koaRouter();

router.get('/', async ctx => {
  ctx.body = 'Auth namespace';
});

router.get('/logout', async ctx => {
  ctx.body = { success: true };
  ctx.logout();
});

router.post('/signin', async (ctx, next) => {
  const errors = await signinValidate(ctx);
  if (errors) {
    await signinValidateErrors(ctx, errors);
  } else {
    await passport.authenticate('local', async (err, account) => {
      if (account === false) {
        ctx.throw(401, 'Incorrect email and password');
      } else {
        ctx.body = { user: {
          _id: account._id,
          email: account.email,
          avatar: account.avatar
        } };
        return ctx.login(account);
      }
    })(ctx, next);
  }

});

router.post('/signup', async (ctx, next) => {
  const errors = await signupValidate(ctx);
  if (errors) {
    await signupValidateErrors(ctx, errors);
  } else {
    const accountExists = await Account.findOne({ email: ctx.request.body.email });
    if (accountExists) {
      ctx.throw(400, 'Email exists');
    } else {
      try {
        const account = new Account(ctx.request.body);
        account.provider = 'local';
        const result = await account.save();
        ctx.body = { user: {
          _id: result._id,
          email: result.email,
          avatar: result.avatar
        } };
        await next();
      } catch (err) {
        next(err);
      }
    }
  }
});

export default router;
