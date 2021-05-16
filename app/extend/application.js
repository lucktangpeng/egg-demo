'use strict';

const RPCClient = require('@alicloud/pop-core').RPCClient;

function initVodClient(accessKeyId, accessKeySecret) {
  const regionId = 'cn-shenzhen'; // 点播服务接入区域
  const client = new RPCClient({
    accessKeyId,
    accessKeySecret,
    endpoint: 'http://vod.' + regionId + '.aliyuncs.com',
    apiVersion: '2017-03-21',
  });

  return client;
}

let vodClient = null;

module.exports = {
  get vodClient() {
    if (!vodClient) {
      vodClient = initVodClient(this.config.vod.accessKeyId, this.config.vod.accessKeySecret);
    }
    return vodClient;
  },
};
