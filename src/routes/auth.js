import koaRouter from 'koa-router';

const router = koaRouter();

router.get('/', async ctx => {
  ctx.body = 'Auth namespace';
});

router.get('/signin', async ctx => {
  ctx.body = {
    message: 'There is signin logic...'
  };
});

export default router;
