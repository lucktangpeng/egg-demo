'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async create() {
    const body = this.ctx.request.body;
    this.ctx.validate({
      email: { type: 'email' },
      password: { type: 'string' },
    });
    if (await this.service.helper.findByUserName(body.username)) {
      this.ctx.throw(422, '用户已存在');
    }
    if (await this.service.helper.findByEmail(body.email)) {
      this.ctx.throw(422, '邮箱已存在');
    }


    const user = await this.service.helper.createUser(body);
    const token = this.service.helper.createToken({ userId: user._id });
    this.ctx.body = { user: {
      email: user.email,
      token,
      username: user.username,
      channelDescription: user.channelDescription,
      avatar: user.avatar,
    } };
  }

  async login() {
    const body = this.ctx.request.body;
    // 检查用户邮箱是否存在
    const email = await this.service.helper.findByEmail(body.email);
    if (!email) {
      this.ctx.throw(422, '邮箱不存在');
    }
    // 检查密码是否正确
    if (this.ctx.helper.md5(body.password) !== email.password) {
      this.ctx.throw(422, '密码不正确');
    }

    // 生产token
    const token = this.service.helper.createToken({
      userId: email._id,
    });
    // 返回响应
    this.ctx.body = { user: {
      email: email.email,
      token,
      username: email.username,
      channelDescription: email.channelDescription,
      avatar: email.avatar,
    } };
  }
  async getUser() {
    this.ctx.body = { user: {
      email: this.ctx.user.email,
      token: this.ctx.token,
      username: this.ctx.user.username,
      channelDescription: this.ctx.user.channelDescription,
      avatar: this.ctx.user.avatar,
    } };
  }

  async Userupdate() {
    // this.ctx.body = { data: '成功' };
    const body = this.ctx.request.body;
    // 1. 基本数据验证
    this.ctx.validate({
      email: { type: 'email', required: false },
      username: { type: 'string', required: false },
      avatar: { type: 'string', required: false },
      channelDescription: { type: 'string', required: false },
    });
    // 2. 校验用户是否存在
    if (body.username) {
      if (this.ctx.user.username !== body.username && await this.ctx.model.User.findById(this.ctx.user._id)) {
        this.ctx.throw('用户名已存在');
      }
    }
    // 3. 校验邮箱是否存在
    if (body.email) {
      if (this.ctx.user.email !== body.email && await this.ctx.model.User.findById(this.ctx.user._id)) {
        this.ctx.throw('邮箱已存在');
      }
    }
    // // console.log('和楼');
    // // // 4. 更新用户信息

    const user = await this.ctx.service.helper.updateUser(body);
    // console.log(user);
    this.ctx.body = { user };
    // console.log(user, '这是我更新后的user');
    // // 5. 返回更新之后的用户信息

  }

  async subscribe() {

    const userId = this.ctx.user._id;
    const channelId = this.ctx.params.userId;
    // 用户不能订阅自己
    if (userId.equals(channelId)) {
      this.ctx.throw(422, '用户不能订阅自己');
    }
    // 添加订阅
    const user = await this.ctx.service.helper.subscribe(userId, channelId);
    // 发送响应逻辑
    this.ctx.body = {
      user: {
        ...this.ctx.helper._.pick(user, [
          'username',
          'email',
          'avatar',
          'cover',
          'subscribersCount',
          'channelDescription',
        ]),
        isSubscribed: true,
      },
    };
  }

  async unsubscribe() {
    const userId = this.ctx.user._id;
    const channelId = this.ctx.params.userId;
    const user = await this.ctx.service.helper.unsubscribe(userId, channelId);
    this.ctx.body = {
      user: {
        ...this.ctx.helper._.pick(user, [
          'username',
          'email',
          'avatar',
          'cover',
          'subscribersCount',
          'channelDescription',
        ]),
        isSubscribed: false,
      },
    };
  }

  async getCurrentUser() {
    let isSubscribed = false;
    const { Subscription, User } = this.ctx.model;
    const channelId = this.ctx.params.userId;
    if (this.ctx.user) {

      // 获取订阅状态
      const userId = this.ctx.user._id;
      const result = await Subscription.findOne({
        user: userId,
        channel: channelId,
      });
      if (result) {
        isSubscribed = true;
      }
    }
    // 获取用户信息
    const user = await User.findById(channelId);


    // 发送响应
    this.ctx.body = {
      user: {
        ...this.ctx.helper._.pick(user, [
          'username',
          'email',
          'avatar',
          'cover',
          'subscribersCount',
          'channelDescription',
        ]),
        isSubscribed,
      },
    };
  }

  async getSubscripteions() {
    console.log('进来了嘛');
    const { Subscription } = this.app.model;
    let subscription = await Subscription.find({
      user: this.ctx.params.userId,
    }).populate('channel');
    subscription = subscription.map(item => {
      return this.ctx.helper._.pick(item.channel, [
        '_id',
        'username',
        'avatar',
      ]);
    });

    this.ctx.body = {
      subscription,
    };
  }
}

module.exports = UserController;
