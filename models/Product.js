const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ProductSchema = new mongoose.Schema({
  _id: { type: String, default: () => uuidv4() },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: String, required: true },
  stock_quantity: { type: String, required: true },
  supplier_id: { type: String }, // referencia a Supplier._id (string UUID)
  status: { type: String, default: 'on' }
}, { timestamps: true });

ProductSchema.virtual('id').get(function() { return this._id; });

module.exports = mongoose.model('Product', ProductSchema);
