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
    if (email === account.email && password === account.password) {
      done(null, account);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(null, false);
  }
}));

export default passport;
