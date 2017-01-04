import Account from './../models/account';

const isAuthenticated = async (ctx, next) => {
  if (ctx.session.passport) {
    try {
      const account = await Account.findOne({ _id: ctx.session.passport.user });
      ctx.body = account;
    } catch (err) {
      ctx.jsonThrow(401, { error: 'fail authorization' });
    }
  } else {
    ctx.jsonThrow(401, { error: 'fail authorization' });
  }
};

export default isAuthenticated;
