const fs = require("fs");
const { validationResult } = require("express-validator");

const { Products } = require("../models/productSchema");

/**
 * Mengecek value fields dari request.body.
 * jika tipe array dan value lebih dari satu,
 * maka mengembalikkan spread pada array.
 * jika tidak, mengembalikkan default value.
 *
 * @param {request.body.*} fields
 *
 * @return array | spread array
 */
function checkMultipleValue(fields) {
  const isArray = Array.isArray(fields);
  const isMoreThanOne = fields.length > 1;

  if (isArray && isMoreThanOne) {
    return [...fields];
  }

  return [fields];
}

/**
 * Mengakses files untuk mengambil path dan filename.
 *
 * @param {req.files} files
 *
 * @return array
 */
function getFiles(files) {
  return files.map((file) => ({
    path: file.path,
    filename: file.filename,
  }));
}

/**
 * Checks files and if available delete
 *
 * @param {image file path} path
 *
 * @return console.error
 */
function checkAndDelete(path) {
  // checking files
  fs.stat(`./${path}`, (err) => {
    if (err) {
      return console.error(err);
    }

    // deleting files is found
    fs.unlink(`./${path}`, (err) => {
      if (err) {
        return console.error(err);
      }
    });
  });
}

/**
 * convert query value to path ascending or descending
 *
 * @param {req.query} query
 *
 * @return String
 */
function queryToFields(query) {
  switch (query) {
    case "high_price":
      return "-prices";
    case "low_price":
      return "prices";
    case "name_from_top":
      return "-name";
    case "name_from_bottom":
      return "name";
    case "high_ratings":
      return "-ratings";
    case "low_ratings":
      return "ratings";
    default:
      return "-ratings";
  }
}

/**
 * store new review to a specified products
 *
 * @param {request} req
 * @param {response} res
 *
 * @return JSON: { message }
 */
exports.addReviews = async (req, res) => {
  // validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { name, rate, review } = req.body;
  const { id } = req.params;

  try {
    // find a specified product
    const product = await Products.findById(id);

    // add a new review
    product.reviews.push({
      name,
      rate,
      review,
    });

    // save a review to database
    await product.save();

    res.status(200).json({
      message: "New review successfully added",
    });
  } catch (err) {
    console.log(err.message, err.stack);

    return res.status(500).json({
      message: "An error occurred when adding",
    });
  }
};

/**
 * getting product data from one category
 *
 * @param {request} req
 * @param {response} res
 *
 * @return JSON: { data, message }
 */
exports.byCategory = async (req, res) => {
  const { category } = req.params;
  const fields = queryToFields(req.query.sortby);

  productByCategory = await Products.find(
    { category },
    "images name prices ratings category"
  ).sort(fields);

  res.status(200).json({
    data: productByCategory,
    message: `${productByCategory.length} products in the category ${category} found`,
  });
};

/**
 * store new products to databases
 *
 * @param {request} req
 * @param {response} res
 *
 * @return JSON: { message }
 */
exports.store = async (req, res) => {
  const {
    name,
    prices,
    size,
    colors,
    stock,
    description,
    ratings,
    category,
  } = req.body;

  try {
    // create a new product
    const product = new Products({
      name,
      description,
      size: checkMultipleValue(size),
      colors: checkMultipleValue(colors),
      category: checkMultipleValue(category),
      prices: Number(prices),
      stock: Number(stock),
      ratings: Number(ratings),
      images: getFiles(req.files),
      reviews: [],
    });

    // saving product
    await product.save();

    res.status(200).json({
      message: "New products successfully created",
    });
  } catch (err) {
    console.log(err.message, err.stack);

    return res.status(500).json({
      message: "An error occurred when saving",
    });
  }
};

/**
 * getting a specified data product
 *
 * @param {request} req
 * @param {response} res
 *
 * @return JSON: { data, message }
 */
exports.show = async (req, res) => {
  const { id } = req.params;

  try {
    let product = await Products.findById(id);

    if (!product) {
      return res.status(404).json({
        data: null,
        message: "Products not found!",
      });
    }

    res.status(200).json({
      data: product,
      message: "One product found",
    });
  } catch (err) {
    console.log(err.message, err.stack);

    return res.status(500).json({
      message: err.message,
    });
  }
};

/**
 * updating a specified product
 *
 * @param {request} req
 * @param {response} res
 *
 * @return JSON: { message }
 */
exports.update = async (req, res) => {
  const { name, prices, size, colors, stock, description, category } = req.body;
  const { id } = req.params;

  try {
    // find a product
    let product = await Products.findById(id);

    // set fields to update
    product.name = name || product.name;
    product.prices = prices || product.prices;
    product.stock = stock || product.stock;
    product.description = description || product.description;
    product.size = checkMultipleValue(size || product.size);
    product.colors = checkMultipleValue(colors || product.colors);
    product.category = checkMultipleValue(category || product.category);

    // updating a specified product
    await product.save();

    res.status(200).json({
      message: "A product successfully update",
    });
  } catch (err) {
    console.log(err.message, err.stack);

    return res.status(500).json({
      message: "An error occurred when updating",
    });
  }
};

/**
 * deleting a specified product
 *
 * @param {request} req
 * @param {response} res
 *
 * @return JSON: { message }
 */
exports.destroy = async (req, res) => {
  const { id } = req.params;

  try {
    // find a product
    const product = await Products.findById(id);

    // delete file images and product
    product.images.map((image) => checkAndDelete(image.path));
    await Products.findByIdAndDelete(id);

    res.status(200).json({
      message: "A product successfully deleted",
    });
  } catch (err) {
    console.log(err.message, err.stack);

    return res.status(500).json({
      message: "An error occurred when deleting",
    });
  }
};
