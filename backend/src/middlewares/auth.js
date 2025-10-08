const jwt = require("jsonwebtoken");
const { User } = require("../sequelize");

exports.protect = async (req, res, next) => {
  if (!req.headers.authorization) {
    return next({
      message: "You need to be logged in to visit this route",
      statusCode: 401,
    });
  }

  const token = req.headers.authorization.replace("Bearer", "").trim();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      attributes: [
        "id",
        "firstname",
        "lastname",
        "username",
        "email",
        "avatar",
        "cover",
        "channelDescription",
        "isAdmin",
      ],
      where: {
        id: decoded.id,
      },
    });

    req.user = user;
    next();
  } catch (err) {
    next({
      message: "You need to be logged in to visit this route",
      statusCode: 401,
    });
  }
};

exports.admin = async (req, res, next) => {
  if (req.user.isAdmin) {
    return next();
  }

  return next({
    message: "Authorization denied, only admins can visit this route",
    statusCode: 401,
  });
};

// Optional authentication - doesn't require login but sets user if authenticated
exports.optionalAuth = async (req, res, next) => {
  if (!req.headers.authorization) {
    req.user = null;
    return next();
  }

  const token = req.headers.authorization.replace("Bearer", "").trim();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      attributes: [
        "id",
        "firstname",
        "lastname",
        "username",
        "email",
        "avatar",
        "cover",
        "channelDescription",
        "isAdmin",
      ],
      where: {
        id: decoded.id,
      },
    });

    req.user = user;
    next();
  } catch (err) {
    req.user = null;
    next();
  }
};
