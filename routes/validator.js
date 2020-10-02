const { Users } = require("../models/userSchema");

exports.checkEmailExist = async (value) => {
  let users = await Users.findOne({ email: value });
  if (users) {
    return Promise.reject("Email already in use");
  }
};

exports.passwordConfirmation = async (value, { req }) => {
  if (value !== req.body.confirmPassword) {
    return Promise.reject("Password confirmation is incorrect");
  }
};
