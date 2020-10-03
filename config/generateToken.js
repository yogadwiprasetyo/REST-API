/*
* Configuration authentication token
*
* Token expire in 24 hours.
* Private string is code my birthday.
* Token have a id, name, email, isLogin , and isAdmin.
*/

// import package jsonwebtoken.
const jwt = require("jsonwebtoken");

// Expirate in 24 hours.
const maxAge = 3 * 24 * 60 * 60;

// Generate token.
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

module.exports = getToken;
