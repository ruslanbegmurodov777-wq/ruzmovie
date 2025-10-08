const { Op } = require("sequelize");
const { VideoLike, Video, User, Subscription, View } = require("../sequelize");
const asyncHandler = require("../middlewares/asyncHandler");

exports.toggleSubscribe = asyncHandler(async (req, res, next) => {
  if (req.user.id === req.params.id) {
    return next({
      message: "You cannot to subscribe to your own channel",
      statusCode: 400,
    });
  }

  const user = await User.findByPk(req.params.id);

  if (!user) {
    return next({
      message: `No user found for ID - '${req.params.id}'`,
      statusCode: 404,
    });
  }

  const isSubscribed = await Subscription.findOne({
    where: {
      subscriber: req.user.id,
      subscribeTo: req.params.id,
    },
  });

  if (isSubscribed) {
    await Subscription.destroy({
      where: {
        subscriber: req.user.id,
        subscribeTo: req.params.id,
      },
    });
  } else {
    await Subscription.create({
      subscriber: req.user.id,
      subscribeTo: req.params.id,
    });
  }

  res.status(200).json({ success: true, data: {} });
});

exports.getFeed = asyncHandler(async (req, res, next) => {
  const subscribedTo = await Subscription.findAll({
    where: {
      subscriber: req.user.id,
    },
  });

  const subscriptions = subscribedTo.map((sub) => sub.subscribeTo);

  const feed = await Video.findAll({
    attributes: ["id", "title", "description", "thumbnail", "createdAt", "category"],
    include: {
      model: User,
      attributes: ["id", "avatar", "username"],
    },
    where: {
      userId: {
        [Op.in]: subscriptions,
      },
    },
    order: [["createdAt", "DESC"]],
  });

  if (!feed.length) {
    return res.status(200).json({ success: true, data: feed });
  }

  for (const video of feed) {
    const views = await View.count({ where: { videoId: video.id } });
    video.setDataValue("views", views);
  }

  res.status(200).json({ success: true, data: feed });
});

exports.editUser = asyncHandler(async (req, res, next) => {
  await User.update(req.body, {
    where: { id: req.user.id },
  });

  const user = await User.findByPk(req.user.id, {
    attributes: [
      "id",
      "firstname",
      "lastname",
      "username",
      "channelDescription",
      "avatar",
      "cover",
      "email",
    ],
  });

  res.status(200).json({ success: true, data: user });
});

exports.searchUser = asyncHandler(async (req, res, next) => {
  if (!req.query.searchterm) {
    return next({ message: "Please enter your search term", statusCode: 400 });
  }

  const users = await User.findAll({
    attributes: ["id", "username", "avatar", "channelDescription"],
    where: {
      username: {
        [Op.substring]: req.query.searchterm,
      },
    },
  });

  if (!users.length)
    return res.status(200).json({ success: true, data: users });

  for (const user of users) {
    const subscribersCount = await Subscription.count({
      where: { subscribeTo: user.id },
    });

    const videosCount = await Video.count({
      where: { userId: user.id },
    });

    const isSubscribed = await Subscription.findOne({
      where: {
        [Op.and]: [{ subscriber: req.user.id }, { subscribeTo: user.id }],
      },
    });

    const isMe = req.user.id === user.id;

    user.setDataValue("subscribersCount", subscribersCount);
    user.setDataValue("videosCount", videosCount);
    user.setDataValue("isSubscribed", !!isSubscribed);
    user.setDataValue("isMe", isMe);
  }

  res.status(200).json({ success: true, data: users });
});

exports.getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id, {
    attributes: [
      "id",
      "firstname",
      "lastname",
      "username",
      "cover",
      "avatar",
      "email",
      "channelDescription",
    ],
  });

  if (!user) {
    return next({
      message: `No user found for ID - ${req.params.id}`,
      statusCode: 404,
    });
  }

  // subscribersCount, isMe, isSubscribed
  const subscribersCount = await Subscription.count({
    where: { subscribeTo: req.params.id },
  });
  user.setDataValue("subscribersCount", subscribersCount);

  const isMe = req.user.id === req.params.id;
  user.setDataValue("isMe", isMe);

  const isSubscribed = await Subscription.findOne({
    where: {
      [Op.and]: [{ subscriber: req.user.id }, { subscribeTo: req.params.id }],
    },
  });
  user.setDataValue("isSubscribed", !!isSubscribed);

  // find the channels this user is subscribed to
  const subscriptions = await Subscription.findAll({
    where: { subscriber: req.params.id },
  });
  const channelIds = subscriptions.map((sub) => sub.subscribeTo);

  const channels = await User.findAll({
    attributes: ["id", "avatar", "username"],
    where: {
      id: { [Op.in]: channelIds },
    },
  });

  for (const channel of channels) {
    const subscribersCount = await Subscription.count({
      where: { subscribeTo: channel.id },
    });
    channel.setDataValue("subscribersCount", subscribersCount);
  }

  user.setDataValue("channels", channels);

  const videos = await Video.findAll({
    where: { userId: req.params.id },
    attributes: ["id", "thumbnail", "title", "createdAt", "category"],
  });

  if (!videos.length)
    return res.status(200).json({ success: true, data: user });

  for (const video of videos) {
    const views = await View.count({ where: { videoId: video.id } });
    video.setDataValue("views", views);
  }

  user.setDataValue("videos", videos);
  res.status(200).json({ success: true, data: user });
});

exports.recommendedVideos = asyncHandler(async (req, res, next) => {
  const videos = await Video.findAll({
    attributes: [
      "id",
      "title",
      "description",
      "thumbnail",
      "userId",
      "createdAt",
      "category",
      "featured",
    ],
    include: [{ model: User, attributes: ["id", "avatar", "username"] }],
    order: [
      ["featured", "DESC"], // Top-rated videos first
      ["createdAt", "DESC"], // Then by newest
    ],
  });

  if (!videos.length)
    return res.status(200).json({ success: true, data: videos });

  for (const video of videos) {
    const views = await View.count({ where: { videoId: video.id } });
    video.setDataValue("views", views);
  }

  res.status(200).json({ success: true, data: videos });
});

exports.recommendChannels = asyncHandler(async (req, res, next) => {
  const channels = await User.findAll({
		limit: 10,
    attributes: ["id", "username", "avatar", "channelDescription"],
    where: {
      id: {
        [Op.not]: req.user.id,
      },
    },
  });

  if (!channels.length)
    return res.status(200).json({ success: true, data: channels });

  for (const channel of channels) {
    const subscribersCount = await Subscription.count({
      where: { subscribeTo: channel.id },
    });
    channel.setDataValue("subscribersCount", subscribersCount);

    const isSubscribed = await Subscription.findOne({
      where: {
        subscriber: req.user.id,
        subscribeTo: channel.id,
      },
    });

    channel.setDataValue("isSubscribed", !!isSubscribed);

    const videosCount = await Video.count({ where: { userId: channel.id } });
    channel.setDataValue("videosCount", videosCount);
  }

  res.status(200).json({ success: true, data: channels });
});

exports.getLikedVideos = asyncHandler(async (req, res, next) => {
  return getVideos(VideoLike, req, res, next);
});

exports.getHistory = asyncHandler(async (req, res, next) => {
  return getVideos(View, req, res, next);
});

const getVideos = async (model, req, res, next) => {
  const videoRelations = await model.findAll({
    where: { userId: req.user.id },
    order: [["createdAt", "ASC"]],
  });

  const videoIds = videoRelations.map((videoRelation) => videoRelation.videoId);

  const videos = await Video.findAll({
    attributes: ["id", "title", "description", "createdAt", "thumbnail", "url", "category"],
    include: {
      model: User,
      attributes: ["id", "username", "avatar"],
    },
    where: {
      id: {
        [Op.in]: videoIds,
      },
    },
  });

  if (!videos.length) {
    return res.status(200).json({ success: true, data: videos });
  }

  for (const video of videos) {
    const views = await View.count({ where: { videoId: video.id } });
    video.setDataValue("views", views);
  }

  res.status(200).json({ success: true, data: videos });
};
