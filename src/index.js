import koaValidator from 'koa-async-validator';

import Koa from 'koa';
import koaRouter from 'koa-router';
import { config, logger } from 'clipbeard';
import bodyParser from 'koa-bodyparser';
import passport from 'koa-passport';
import mongoose from './db';
import jsonThrow from './middleware/json-throw';
import routes from './routes';

const app = new Koa();

const router = koaRouter({
  prefix: config.get('server:api:prefix')
});

app.use(bodyParser());
// add koa-async-validar
app.use(koaValidator());

app.use(jsonThrow);

app.use(passport.initialize());
app.use(passport.session());

// add child routers
router.use('/', routes.main.routes(), routes.main.allowedMethods());
router.use('/auth', routes.auth.routes(), routes.auth.allowedMethods());

app.use(router.routes());

mongoose.connection.on('connected', () => {
  logger.info('Connected to mongodb');
});

const port = config.get('PORT') || config.get('server:port');

if (config.get('environment') !== 'test') {
  app.listen(port, async () => {

    logger.info('Listening port %d', port);
  });
}

export default app;
