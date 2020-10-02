const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  paymentMethod: { type: String, required: true },
});

const orderItemSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, default: 0, required: true },
  quantity: { type: Number, default: 0, required: true },
  //* now, it's just one image
  images: { type: String, required: true },
  //* ^^now, it's just one image^^
  product: {
    type: Schema.Types.ObjectId,
    ref: "Products",
    required: true,
  },
});

const orderSchema = new Schema({
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },
  isSuccess: { type: Boolean, default: false },
  payment: paymentSchema,
  orderItems: [orderItemSchema],
  totalPrice: { type: Number, default: 0, required: true },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

exports.Orders = mongoose.model("Orders", orderSchema);
