/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1620526739076_3812';

  // add your middleware config here
  config.middleware = [ 'errorHandler' ];

  config.mongoose = {
    client: {
      url: 'mongodb://www.tangp.top/youtubeclone',
      options: {
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
      // mongoose global plugins, expected a function or an array of function and options
      // plugins: [ createdPlugin, [ updatedPlugin, pluginOptions ]],
    },
  };
  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.jwt = {
    secret: '6d64aef6-bd0b-483b-b77b-03ee1161a795',
    expiresIn: '1d',
  };

  config.cors = {
    origin: '*',
    // {string|Function} origin: '*',
    // {string|Array} allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
