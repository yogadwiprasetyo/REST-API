const route = require("express").Router();

const isAuth = require("../middleware/isUserAuth");
const isAdmin = require("../middleware/isRoleAdmin");

const {
  index,
  myorders,
  show,
  store,
  success,
  destroy,
} = require("../controller/orderController");

route.get("/", isAuth, isAdmin, index);
route.get("/me", isAuth, myorders);
route.get("/:id", isAuth, show);
route.post("/", isAuth, store);
route.patch("/:id/success", isAuth, success);
route.delete("/:id", isAuth, isAdmin, destroy);

module.exports = route;
