'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const auth = app.middleware.auth();

  router.prefix('/api/v1'); // 设置基础路径
  router.post('/users', controller.user.create);
  router.post('/login', controller.user.login);
  router.get('/user', auth, controller.user.getUser);
  router.patch('/user', auth, controller.user.Userupdate);
  router.get('/user/:userId', app.middleware.auth({ required: false }), controller.user.getCurrentUser);


  // 用户订阅
  router.post('/users/:userId/subscribe', auth, controller.user.subscribe);
  router.delete('/users/:userId/subscribe', auth, controller.user.unsubscribe);
  router.get('/users/:userId/subscripteions', controller.user.getSubscripteions);

  // 阿里云 VOD
  router.get('/vod/CreateUploadVideo', controller.vod.CreateUploadVideo);
  router.get('/vod/RefreshUploadVideo', controller.vod.RefreshUploadVideo);

  // 视频
  router.post('/videos', auth, controller.video.createVideo);
  router.get('/videos/:videoId', app.middleware.auth({ required: false }), controller.video.getVideo);
  router.get('/videos', controller.video.getVideos);
  router.get('/users/:userId/videos', controller.video.getUserVideos); // 获取用户发布的视频列表
  router.get('/user/videos/feed', auth, controller.video.getUserFeedVideos); // 获取用户关注的频道视频列表
  router.get('/videos/:videoId', auth, controller.video.updateVideo); // 更新视频
  router.delete('/videos/:videoId', auth, controller.video.deleteVideo); // 删除视频
  router.post('/videos/:videoId/comments', auth, controller.video.createComment); // 添加视频评论
  router.get('/videos/:videoId/comments', controller.video.getVideoComments); // 获取视频评论列表
  router.delete('/videos/:videoId/comments/:commentId', auth, controller.video.deleteVideoComment); // 删除视频评论
  router.post('/videos/:videoId/like', auth, controller.video.likeVideo); // 喜欢视频
  router.post('/videos/:videoId/dislike', auth, controller.video.dislikeVideo); // 不喜欢视频
  router.get('/user/videos/liked', auth, controller.video.getUserLikedVideos); // 获取用户喜欢的视频列表
};
