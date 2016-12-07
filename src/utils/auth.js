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

passport.use(new local.Strategy(async (eMail, password, done) => {
  console.log('--eMail----' + eMail);
  console.log('--password----' + password);
  try {
    const user = await User.findOne({email: eMail});
    // const user = { id: 1, email: 'user_test@example.com', password: '123' };
    if (eMail === user.email && password === user.password) {
      console.log('--eMail----' + eMail);
      done(null, user);
    } else {
      console.log('--eMail----' + eMail);
      done(null, false);
    }
  } catch (err) {
    done(err);
  }
}));

export default passport;
