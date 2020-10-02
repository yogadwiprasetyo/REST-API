const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    name: { type: String, required: true },
    rate: { type: Number, default: 0, required: true },
    review: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    images: [
      {
        path: { type: String, required: true },
        filename: { type: String, required: true },
      },
    ],
    size: [{ type: String, required: true }],
    colors: [{ type: String, required: true }],
    category: [{ type: String, required: true }],
    description: { type: String, required: true },
    prices: { type: Number, default: 0, required: true },
    stock: { type: Number, default: 0, required: true },
    ratings: { type: Number, default: 0, required: true },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

exports.Products = mongoose.model("Products", productSchema);
