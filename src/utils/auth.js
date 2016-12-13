import passport from 'koa-passport';
import local from 'passport-local';
import Account from '../models/account';

passport.serializeUser((account, done) => {
  done(null, account._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const account = await Account.findById(id);
    done(null, account);
  } catch (err) {
    done(err);
  }
});

passport.use(new local.Strategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const account = await Account.findOne({ email });
    if (!account) {
      return done(null, false);
    }
    if (password !== account.password) {
      return done(null, false);
    }
    return done(null, account);
  } catch (err) {
    done(null, false);
  }
}));

export default passport;
