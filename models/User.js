const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const UserSchema = new mongoose.Schema({
  _id: { type: String, default: () => uuidv4() }, 
  name: { type: String, required: true },
  contact_email: { type: String, required: true },
  user: { type: String, required: true },
  pwd: { type: String, required: true },
  level: { type: String, required: true },
  status: { type: String, default: 'on' }
}, { timestamps: true });

UserSchema.virtual('id').get(function() { return this._id; });

module.exports = mongoose.model('User', UserSchema);
