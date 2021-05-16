'use strict';

const Service = require('egg').Service;
const jwt = require('jsonwebtoken');
class UserService extends Service {
  getUser() {
    return this.app.model.User;
  }

  findByUserName(username) {
    return username ? this.getUser().findOne({ username }) : null;
  }

  findByEmail(email) {
    return email ? this.getUser().findOne({ email }).select('+password') : null;
  }

  createUser(data) {
    data.password = this.ctx.helper.md5(data.password);
    const user = new this.app.model.User(data);
    user.save();
    return user;
  }

  createToken(userIdObj) {
    return jwt.sign(userIdObj, this.app.config.jwt.secret, {
      expiresIn: this.app.config.jwt.expiresIn,
    });
  }

  verifyToken(token) {
    return jwt.verify(token, this.app.config.jwt.secret);
  }
  updateUser(data) {
    return this.app.model.User.findByIdAndUpdate(this.ctx.user._id, data, { new: true });
  }

  async subscribe(userId, channelId) {
    // 检查是否已经订阅
    const { Subscription, User } = this.ctx.model;
    const result = await Subscription.findOne({
      user: userId,
      channel: channelId,
    });
    // 添加订阅
    const user = await User.findById(userId);
    // console.log(user, '这里有木有');
    if (!result) {
      new Subscription({
        user: userId,
        channel: channelId,
      }).save();
      // console.log(user.subscribersCount, '这里有木有');
      user.subscribersCount++;
      await user.save();
    }

    // 返回信息
    return user;
  }
  async unsubscribe(userId, channelId) {
    // 检查是否已经订阅
    const { Subscription, User } = this.ctx.model;
    const result = await Subscription.findOne({
      user: userId,
      channel: channelId,
    });
    // 添加订阅
    const user = await User.findById(userId);
    // console.log(user, '这里有木有');
    if (result) {
      await result.remove();
      // console.log(user.subscribersCount, '这里有木有');
      user.subscribersCount--;
      await user.save();
    }

    // 返回信息
    return user;
  }
}

module.exports = UserService;
