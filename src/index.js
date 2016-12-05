import Koa from 'koa';
import koaRouter from 'koa-router';
import { config, logger } from 'clipbeard';
import sleep from './sleep';

var mongoose = require('./config/mongoose');

//var passport = require('./config/passport');
import passport from 'passport';
require('./config/passport')(passport);

const app = new Koa();
const router = koaRouter();

var db = mongoose();
//var passport = passport();

router.get('/', async ctx => {
  ctx.body = 'Hello All together';
  console.log('a');
  await sleep(2000);
  console.log('b');
  //console.log(JSON.stringify(ctx));

});

router.get('/world', async ctx => {
  ctx.body = 'Who are you?';
});


app.use(router.routes());
const port = config.get('PORT') || config.get('server:port');

app.use(passport.initialize());
app.use(passport.session());

app.listen(port, async () => {

  logger.info('Listening port %d', port);
});
