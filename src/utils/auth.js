import passport from 'koa-passport';
import local from 'passport-local';
import User from '../models/account';

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(new local.Strategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  console.log('--eMail--1--' + email);
  console.log('--password--2--' + password);
  try {
    // const users = await User.find({});
    const user = await User.findOne({email: email});
    console.log('---after findOne----' + JSON.stringify(user));
    if (email === user.email && password === user.password) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err);
  }
}));

export default passport;
