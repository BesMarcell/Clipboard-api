import koaRouter from 'koa-router';
import passport from '../utils/auth';
import { signupValidate, signinValidate, signinValidateErrors, signupValidateErrors } from '../utils/auth.validate';
import Account from '../models/account';
import isAuthenticated from './../middleware/is-authenticated';

const router = koaRouter();

router.get('/', isAuthenticated, async ctx => {
  const account = await Account.findOne({ _id: ctx.session.passport.user });
  ctx.body = account;
});

router.get('/logout', async ctx => {
  ctx.body = { success: true };
  ctx.session = null;
  ctx.logout();
});

router.post('/signin', async (ctx, next) => {
  const errors = await signinValidate(ctx);
  if (errors) {
    return await signinValidateErrors(ctx, errors);
  }
  await passport.authenticate('local', async (err, account) => {
    if (account === false) {
      return ctx.jsonThrow(401, { error: 'Incorrect email and password' });
    }
    ctx.body = account;
    ctx.login(account);
    return ctx.body;
  })(ctx, next);
});

router.post('/signup', async (ctx, next) => {
  const errors = await signupValidate(ctx);
  if (errors) {
    return await signupValidateErrors(ctx, errors);
  }
  const accountExists = await Account.findOne({ email: ctx.request.body.email });
  if (accountExists) {
    ctx.type = 'json';
    return ctx.jsonThrow(400, { error: 'email exists' });
  }
  try {
    const account = new Account(ctx.request.body);
    account.provider = 'local';
    const result = await account.save();
    ctx.body = result;
    ctx.login(account);
  } catch (err) {
    next(err);
  }
});

export default router;
