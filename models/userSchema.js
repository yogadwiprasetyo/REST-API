const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shippingSchema = new Schema({
  address: String,
  city: String,
  country: String,
});

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    imageProfile: { type: String, required: true },
    phone: { type: Number, default: 0, required: true },
    isAdmin: { type: Boolean, default: false },
    shipping: shippingSchema,
  },
  { timestamps: true }
);

exports.Users = mongoose.model("Users", userSchema);
