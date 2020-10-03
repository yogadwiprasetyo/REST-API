// Import orders schema
const { Orders } = require("../models/orderSchema");

/*
* Checking is user buying this product.
*
* Find user in order schema and match 
* product with id parameters.
*
* @param {request} req
* @param {response} res
* @param {callback} next
*
* @return JSON { message }
*
*/
const isBuying = async (req, res, next) => {
  try {
    const order = await Orders.findOne({
      user: req.user._id,
    }).elemMatch("orderItems", {
      product: req.params.id,
    });

    if (!order) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    next();
  } catch (err) {
    console.log(err.message, err.stack);

    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

module.exports = isBuying;
