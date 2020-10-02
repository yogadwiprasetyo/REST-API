const route = require("express").Router();
const { check } = require("express-validator");

const { uploadProfiles } = require("../config/filesystem");
const isAuth = require("../middleware/isUserAuth");

const { checkEmailExist, passwordConfirmation } = require("./validator");

const {
  index,
  show,
  edit,
  update,
  login,
  register,
  logout,
  destroy,
} = require("../controller/userController");
const isAdmin = require("../middleware/isRoleAdmin");

route.get("/", isAuth, isAdmin, index);
route.get("/profile", isAuth, show);
route.get("/edit", isAuth, edit);
route.put(
  "/update",
  [
    check("name").trim().escape(),
    check("email", "Please enter a valid email").isEmail().normalizeEmail(),
    check("phone", "A phone is number, not something else").toInt(),
  ],
  isAuth,
  // * validation results occurred when using form-data
  // uploadProfiles.single("imageProfile")
  update
);
route.post(
  "/login",
  [check("email", "Please enter a valid email").isEmail()],
  login
);
route.post(
  "/register",
  [
    check("email").isEmail().custom(checkEmailExist),
    check("password").custom(passwordConfirmation),
    check("phone", "A phone is number, not something else").toInt().isInt(),
  ],
  register
);
route.delete("/logout", logout);
route.delete("/:id", isAuth, isAdmin, destroy);

module.exports = route;
