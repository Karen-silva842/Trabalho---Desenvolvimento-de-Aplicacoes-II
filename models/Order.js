const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const OrderItemSchema = new mongoose.Schema({
  product_id: { type: String, required: true },
  quantity: { type: Number, required: true },
  campaign_id: { type: String },
  unit_price: { type: String, required: true }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  _id: { type: String, default: () => uuidv4() },
  store_id: { type: String, required: true },
  item: { type: [OrderItemSchema], required: true },
  total_amount: { type: String, required: true },
  status: { type: String, required: true },
  date: { type: String, required: true }
}, { timestamps: true });

OrderSchema.virtual('id').get(function() { return this._id; });

module.exports = mongoose.model('Order', OrderSchema);
