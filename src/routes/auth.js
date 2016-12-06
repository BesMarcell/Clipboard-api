import koaRouter from 'koa-router';
import authUtils from './utils/authUtils';

const router = koaRouter();

router.get('/', async ctx => {
  ctx.body = 'Auth namespace';
});

router.get('/signin', async ctx => {
  ctx.body = {
    message: 'There is signin logic...'
  };
});

router.post('/signup', async ctx => {
  ctx.body = {
    message: 'There is signup logic...'
  };
});

router.get('/logout', async ctx => {
  ctx.body = {
    message: 'There is logout logic...'
  };
  console.log(JSON.stringify(ctx));
});

export default router;
