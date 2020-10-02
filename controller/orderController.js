const { Orders } = require("../models/orderSchema");

/**
 * Getting all orders data
 *
 * @param {request} req
 * @param {response} res
 *
 * @return JSON { data, message }
 */
exports.index = async (req, res) => {
  try {
    const orders = await Orders.find(
      {},
      "user payment isPaid isDelivered isSuccess"
    ).populate("users");

    res.status(200).json({
      data: orders,
      message: `${orders.length} orders found`,
    });
  } catch (err) {
    console.log(err.message, err.stack);

    res.status(500).json({
      message: err.message,
    });
  }
};

/**
 * Getting a specified data orders from the user
 *
 * @param {request} req
 * @param {response} res
 *
 * @return JSON { data, message }
 */
exports.myorders = async (req, res) => {
  const { _id } = req.user;

  try {
    const myOrder = await Orders.find(
      { user: _id },
      "orderItems payment totalPrice"
    );

    res.status(200).json({
      data: myOrder,
      message: `${myOrder.length} orders found`,
    });
  } catch (err) {
    console.log(err.message, err.stack);

    res.status(500).json({
      message: err.message,
    });
  }
};

/**
 * Showing a specific orders
 *
 * @param {request} req
 * @param {response} res
 *
 * @return JSON { data, message }
 */
exports.show = async (req, res) => {
  const { id } = req.params;

  try {
    const orderDetails = await Orders.findById(id);

    // if order details not found
    // status: 404 and message
    if (!orderDetails) {
      return res.status(404).json({
        data: null,
        message: "Orders not found",
      });
    }

    res.status(200).json({
      data: orderDetails,
      message: "Orders found",
    });
  } catch (err) {
    console.log(err.message, err.stack);

    res.status(500).json({
      message: err.message,
    });
  }
};

/**
 * Store new order to resources
 *
 * @param {request} req
 * @param {response} res
 *
 * @return JSON { message }
 */
exports.store = async (req, res) => {
  const { orderItems, totalPrice, payment, isPaid, paidAt } = req.body;
  const { _id } = req.user;

  try {
    // create new orders
    const newOrders = new Orders({
      user: _id,
      orderItems,
      totalPrice,
      payment,
      isPaid,
      paidAt,
    });

    // saving orders
    await newOrders.save();

    res.status(200).json({
      message: "Order saved successfully",
    });
  } catch (err) {
    console.log(err.message, err.stack);

    return res.status(500).json({
      message: "An error occurred when saving",
    });
  }
};

/**
 * Updating the order has been placed successfully
 *
 * @param {request} req
 * @param {response} res
 *
 * @return JSON { message }
 */
exports.success = async (req, res) => {
  const { id } = req.params;

  try {
    const updatingOrder = await Orders.findById(id);

    // updating few fields
    updatingOrder.isSuccess = true;
    updatingOrder.isDelivered = true;
    updatingOrder.deliveredAt = new Date().toJSON();

    // saving update
    await updatingOrder.save();

    res.status(200).json({
      message: "Order updated successfully",
    });
  } catch (err) {
    console.log(err.message, err.stack);

    return res.status(500).json({
      message: "An error occurred when updating",
    });
  }
};

/**
 * Remove a specific order from resources
 *
 * @param {request} req
 * @param {response} res
 *
 * @return JSON { message }
 */
exports.destroy = async (req, res) => {
  const { id } = req.params;

  try {
    await Orders.findByIdAndDelete(id);

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    console.log(err.message, err.stack);

    return res.status(500).json({
      message: "An error occurred when deleting",
    });
  }
};
