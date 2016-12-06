import koaRouter from 'koa-router';
import passport from 'koa-passport';
import authUtils, {renderSignin, renderSignup, signUp} from '../utils/auth';

const router = koaRouter();

router.get('/', async ctx => {
  ctx.body = 'Auth namespace';
});

router.get('/signin', async ctx => renderSignin(ctx));
router.post('/signin', async () => {
  await passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signin'
  });
});

router.post('/signup', async ctx => signUp(ctx));
router.get('/signup', async ctx => renderSignup(ctx));

router.get('/logout', async () => {
  await ctx.logout();
  await ctx.redirect('/');
});

/*
router.post('/signup', async ctx => {
  ctx.body = {
    message: 'There is signup logic...'
  };
});
*/

export default router;
