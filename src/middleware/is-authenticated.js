const isAuthenticated = async (ctx, next) => {
  if (ctx.session.passport) {
    await next();
  } else {
    ctx.jsonThrow(401, { error: 'Unauthorized' });
  }
};
export default isAuthenticated;
