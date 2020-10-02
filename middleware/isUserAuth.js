const isAuth = async (req, res, next) => {
  if (!req.user.isLogin) {
    return res.status(401).redirect("/login");
  }

  next();
};

module.exports = isAuth;
