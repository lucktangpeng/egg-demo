'use strict';
module.exports = (options = { required: true }) => {
  return async (ctx, next) => {
    // 获取请求头中的token数据
    let token = ctx.headers.authorization;
    token = token
      ? token.split('Bearer ')[1]
      : null;
    if (token) {
      ctx.token = token;
      try {
        const data = ctx.service.helper.verifyToken(token);
        // 将user挂载到user对象上
        ctx.user = await ctx.model.User.findById(data.userId);
      } catch (e) {
        ctx.throw(e);
      }
    } else if (options.required) {
      ctx.throw(401);
    }

    await next();
  };
};
