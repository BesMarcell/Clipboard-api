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
  try {
    const user = await User.findOne({email: email});
    if (email === user.email && password === user.password) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(null, false);
  }
}));

export default passport;
