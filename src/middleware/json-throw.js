const jsonThrow = async (ctx, next) => {
  ctx.jsonThrow = (status, error) => {
    ctx.status = status;
    ctx.body = error;
  };
  await next();
};

export default jsonThrow;
