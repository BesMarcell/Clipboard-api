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
  try {
    const user = await User.findOne({email: eMail});
    // const user = { id: 1, email: 'user_test@example.com', password: '123' };
    if (eMail === user.email && password === user.password) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err);
  }
}));

export default passport;
/*
export const renderSignin = async (req, res, next) => {
  if (!req.user) {

  } else {
    return res.redirect('/');
  }
};

export const renderSignup = async (req, res, next) => {
  if (!req.user) {
    console.log('Will be send something on signup page');
  } else {
    return res.redirect('/');
  }
};

export const signUp = async (req, res, next) => {
  const user = new User(req.body);
  user.provider = 'local';
  try {
    await user.save();
    await req.login(user);
  } catch (err) {
    next(err);
  }
};
*/
