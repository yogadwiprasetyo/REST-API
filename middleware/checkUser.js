const jwt = require("jsonwebtoken");

const checkUser = (req, res, next) => {
  const accessToken = req.cookies.jwt;
  const privateKey = req.headers.privatekey;

  try {
    const decoded = jwt.verify(accessToken, privateKey);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err.message);
    req.user = { isLogin: false };
    next();
  }
};

module.exports = checkUser;
