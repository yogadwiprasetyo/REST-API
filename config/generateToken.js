const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;
const getToken = (user) =>
  jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isLogin: true,
    },
    "209018",
    {
      expiresIn: maxAge,
    }
  );

module.exports = {
  getToken,
};
