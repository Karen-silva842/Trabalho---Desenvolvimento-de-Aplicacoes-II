const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const StoreSchema = new mongoose.Schema({
  _id: { type: String, default: () => uuidv4() },
  store_name: { type: String, required: true },
  cnpj: { type: String, required: true },
  address: { type: String, required: true },
  phone_number: { type: String, required: true },
  contact_email: { type: String, required: true },
  status: { type: String, default: 'on' }
}, { timestamps: true });

StoreSchema.virtual('id').get(function() { return this._id; });

module.exports = mongoose.model('Store', StoreSchema);
