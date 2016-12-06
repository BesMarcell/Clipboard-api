import passport from 'koa-passport';
  // After here will be logic passport.serializeUser, passport.deserializeUser and other
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

passport.use(new local.Strategy(async (email, password, done) => {
  try {
    const user = await User.findOne({email: email});
    if (email === user.email && password === user.password) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err);
  }
}));

export const renderSignin = async (req, res, next) => {
  if (!req.user) {
    console.log('Will be send something on signin page');
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
  if (!req.user) {
    const user = new User(req.body);
    user.provider = 'local';
    try {
      await user.save();
      await req.login(user);
      return res.redirect('/');
    } catch (err) {
      next(err);
    }
  } else {
    return res.redirect('/');
  }
};
