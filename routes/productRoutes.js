const route = require("express").Router();
const { check } = require("express-validator");

const { uploadProducts } = require("./../config/filesystem");
const isAdmin = require("../middleware/isRoleAdmin");
const isAuth = require("../middleware/isUserAuth");
const isBuying = require("../middleware/isBuyingProduct");

const {
  show,
  store,
  update,
  destroy,
  addReviews,
  byCategory,
} = require("../controller/productController");

route.get("/c/:category", byCategory);
route.get("/:id", show);
route.get("/:id/edit", isAuth, isAdmin, show);
route.post("/", isAuth, isAdmin, uploadProducts.array("images", 5), store);
route.put("/:id", isAuth, isAdmin, update);
route.delete("/:id", isAuth, isAdmin, destroy);
route.post(
  "/:id/reviews",
  [
    check("name").trim().escape(),
    check("rate").toInt().isInt(),
    check("review").trim().escape(),
  ],
  isAuth,
  isBuying,
  addReviews
);

module.exports = route;
