'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx, app } = this;
    const data = await app.model.User.find();
    ctx.body = { data };
  }
}

module.exports = HomeController;
