import Koa from 'koa';
import koaRouter from 'koa-router';
import { config, logger } from 'clipbeard';

const app = new Koa();
const router = koaRouter();

router.get('/', async ctx => {

  ctx.body = 'Hello';
});


const port = config.get('PORT') || config.get('server:port');
app.listen(port, async () => {

  logger.info('Listening port %d', port);
});
