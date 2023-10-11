const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;
const commonSchema = require("../../utils/commonSchema");

const orderSchema = new Schema({
  id: { type: String, required: true, index: { unique: true } },
  name: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  amount: { type: Number, required: true },
  products: [
    {
      product: { type: ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      amount: { type: Number, required: true },
    },
  ],
  paymentMethod: {
    type: String,
    enum: ["COD", "CC", "Paypal"],
    default: "COD",
    required: true,
  },
  payment: { type: String, default: "COD", required: true },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
    required: true,
  },
  ...commonSchema,
});

module.exports = model("Order", orderSchema);
