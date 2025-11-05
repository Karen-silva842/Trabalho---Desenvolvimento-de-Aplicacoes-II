const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const SupplierSchema = new mongoose.Schema({
  _id: { type: String, default: () => uuidv4() },
  supplier_name: { type: String, required: true },
  supplier_category: { type: String, required: true },
  contact_email: { type: String, required: true },
  phone_number: { type: String, required: true },
  status: { type: String, default: 'on' }
}, { timestamps: true });

SupplierSchema.virtual('id').get(function() { return this._id; });

module.exports = mongoose.model('Supplier', SupplierSchema);
