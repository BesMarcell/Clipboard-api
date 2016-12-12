export const signupValidate = async ctx => {
  ctx.sanitize('email').trim();
  ctx.sanitize('password').trim();
  ctx.checkBody({
    email: {
      notEmpty: true,
      isEmail: {
        errorMessage: 'Invalid Email'
      }
    },
    password: {
      notEmpty: true,
      isLength: {
        options: [{ min: 6 }],
        errorMessage: 'Password must be longer then 5 chars'
      }
    }
  });
  const errors = await ctx.validationErrors();
  return errors;
};

export const signinValidate = async ctx => {
  ctx.checkBody({
    email: {
      notEmpty: true,
      isEmail: {
        errorMessage: 'Invalid Email'
      }
    },
    password: {
      notEmpty: true,
      isLength: {
        options: [{ min: 6 }],
        errorMessage: 'Password must be longer then 5 chars'
      }
    }
  });
  const errors = await ctx.validationErrors();
  return errors;
};

export const signinValidateErrors = async (ctx, errors) => {
  ctx.status = 401;
  ctx.body = { err: errors };
};

export const signupValidateErrors = async (ctx, errors) => {
  ctx.status = 400;
  ctx.body = { err: errors };
};
