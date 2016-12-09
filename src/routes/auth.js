// import util from 'util';
import koaRouter from 'koa-router';
import passport from '../utils/auth';

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
  // koa-async-validator ->
  ctx.checkBody({
    email: {
      notEmpty: true,
      isEmail: {
        errorMessage: 'Invalid Email'
      }
    },
    password: {
      isLength: {
        options: [{ min: 6 }],
        errorMessage: 'Password must be longer then 5 chars'
      }
    }
  });
  const errors = await ctx.validationErrors();
  if (errors) {
    ctx.status = 401;
  } else {
    await passport.authenticate('local', async (err, account) => {
      if (account === false) {
        ctx.throw(401);
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
  // koa-async-validator ->
  ctx.checkBody({
    email: {
      notEmpty: true,
      isEmail: {
        errorMessage: 'Invalid Email'
      }
    },
    password: {
      isLength: {
        options: [{ min: 6 }],
        errorMessage: 'Password must be longer then 5 chars'
      }
    }
  });
  const errors = await ctx.validationErrors();
  if (errors) {
    ctx.status = 400;
  } else {
  // <- koa-async-validator
    const accountExists = await Account.findOne({ email: ctx.request.body.email });
    if (accountExists) {
      ctx.throw(400);
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
