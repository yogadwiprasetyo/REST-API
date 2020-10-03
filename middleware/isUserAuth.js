/*
* Check whether the user has been 
* authenticated via user data.
*
* @param {request} req
* @param {response} res
* @param {callback} next
*
* @return Redirect or Callback
*/
const isAuth = async (req, res, next) => {
  if (!req.user.isLogin) {
    return res.status(401).redirect("/login");
  }

  next();
};

module.exports = isAuth;
