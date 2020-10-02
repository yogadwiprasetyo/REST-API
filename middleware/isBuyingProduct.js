const { Orders } = require("../models/orderSchema");

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
