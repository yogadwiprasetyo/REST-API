const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const { Users } = require("../models/userSchema");
const { Orders } = require("../models/orderSchema");
const { getToken } = require("../config/generateToken");

/**
 * Getting all data users
 *
 * @param {request} req
 * @param {response} res
 *
 * @return JSON: { data, message }
 */
exports.index = async (req, res) => {
  try {
    const users = await Users.find({}, "name email phone isAdmin");

    res.status(200).json({
      data: users,
      message: `${users.length} users found`,
    });
  } catch (err) {
    console.log(err.message, err.stack);

    res.status(500).json({
      message: err.message,
    });
  }
};

/**
 * register a new user
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @return JSON: { message }
 */
exports.register = async (req, res) => {
  // Validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const {
    name,
    email,
    phone,
    address,
    city,
    country,
    password,
    imageProfile,
    isAdmin,
  } = req.body;

  try {
    // create a new user
    const user = new Users({
      name,
      email,
      phone,
      isAdmin,
      password,
      imageProfile,
      shipping: {
        address,
        city,
        country,
      },
    });

    // hashing password user
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.confirm_password = await bcrypt.hash(password, salt);

    // saving new user
    await user.save();

    res.status(200).json({
      message: "New users successfully created",
    });
  } catch (err) {
    console.log(err.message, err.stack);

    return res.status(500).json({
      message: "An error occurred when saving",
    });
  }
};

/**
 * signin to the application
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @return JSON: { token, message }
 */
exports.login = async (req, res) => {
  // Validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;

  // Check user is exist
  let userSignin = await Users.findOne({ email });
  if (!userSignin) {
    return res.status(400).json({
      message: "User not exist",
    });
  }

  // Check password is match
  const isMatch = await bcrypt.compare(password, userSignin.password);
  if (!isMatch) {
    return res.status(400).json({
      message: "Incorrect password",
    });
  }

  // generate token
  const token = getToken(userSignin);

  res.cookie("jwt", token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 });
  res.status(200).json({
    token,
    message: "Login successfully",
  });
};

/**
 * Logout to the application
 *
 * @param {request} req
 * @param {response} res
 */
exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

/**
 * Show details users
 *
 * @param {request} req
 * @param {response} res
 *
 * @return JSON: { data, message }
 */
exports.show = async (req, res) => {
  const { _id } = req.user;

  try {
    const user = await Users.findById(_id, "name email imageProfile");

    const orders = await Orders.find({ user: _id }, "orderItems");

    res.status(200).json({
      data: {
        user,
        orders,
      },
      message: "One user found",
    });
  } catch (err) {
    console.error(err.message, err.stack);

    res.status(500).json({
      message: err.message,
    });
  }
};

/**
 * getting data from the specified a user
 *
 * @param {request} req
 * @param {response} res
 *
 * @return JSON: { data, message }
 */
exports.edit = async (req, res) => {
  const { _id } = req.user;
  const user = await Users.findById(_id).select(
    "name email phone imageProfile"
  );

  // User not found, return status 404
  // data: null, message
  if (!user) {
    return res.status(404).json({
      data: null,
      message: "User not found",
    });
  }

  res.status(200).json({
    data: user,
    message: "One user found",
  });
};

/**
 * updating a specified user
 *
 * @param {request} req
 * @param {response} res
 *
 * @return JSON: { message }
 */
exports.update = async (req, res) => {
  // validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { name, email, phone, address, city, country } = req.body;
  const { _id } = req.user;

  try {
    let user = await Users.findById(_id);

    // set fields to update
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    // * validation results occurred when using form-data
    // user.imageProfile = req.file.filename || user.imageProfile;
    user.shipping = {
      city: city || user.shipping.city,
      address: address || user.shipping.address,
      country: country || user.shipping.country,
    };

    // Updating a specified user
    await user.save();

    res.status(200).json({
      message: "User updated successfully",
    });
  } catch (err) {
    console.log(err.message, err.stack);

    res.status(500).json({
      message: "An error occurred when updating",
    });
  }
};

/**
 * Delete a specified user
 *
 * @param {request} req
 * @param {response} res
 *
 * @return JSON: { message }
 */
exports.destroy = async (req, res) => {
  const { _id } = req.user;

  try {
    await Users.findByIdAndDelete(id);

    res.status(200).json({
      message: "Users deleted successfully",
    });
  } catch (err) {
    console.log(err.message, err.stack);

    res.status(500).json({
      message: "An error occurred when deleting",
    });
  }
};
