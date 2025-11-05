const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const CampaignSchema = new mongoose.Schema({
  _id: { type: String, default: () => uuidv4() },
  supplier_id: { type: String, required: true },
  name: { type: String, required: true },
  start_date: { type: String, required: true },
  end_date: { type: String, required: true },
  discount_percentage: { type: String, required: true }
}, { timestamps: true });

CampaignSchema.virtual('id').get(function() { return this._id; });

module.exports = mongoose.model('Campaign', CampaignSchema);
