// import package jsonwebtoken
const jwt = require("jsonwebtoken");

/*
* Check user when come to website, if have cookies jwt, 
* user is login and verify token then set request user 
* with data in jwt.
*
* If jwt expired and not has cookies jwt, user is not login
* and set request user to is login false. 
*
* @param {request} req
* @param {response} res
* @param {callback} next
*/
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
