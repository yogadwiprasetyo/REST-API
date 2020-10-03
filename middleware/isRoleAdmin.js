/*
* Check the user is admin via data user.
*
* @param {request} req
* @param {response} res
* @param {callback} next
*
* @return JSON or Callback
*/
const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }

  return res.status(403).json({
    message: "Unauthorized",
  });
};

module.exports = isAdmin;
