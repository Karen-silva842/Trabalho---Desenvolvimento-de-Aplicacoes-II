const fs = require('fs');
const path = require('path');
console.log('Tentando carregar:', path.resolve(__dirname, '../config/db'));
const connectDB = require('../config/db');
const User = require('../models/User');
const Supplier = require('../models/Supplier');
const Store = require('../models/Store');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Campaign = require('../models/Campaign');

const DATA_DIR = path.join(__dirname, '..', 'data');

const readJson = (filename) => {
  try {
    const content = fs.readFileSync(path.join(DATA_DIR, filename), 'utf8');
    return JSON.parse(content);
  } catch (err) {
    return [];
  }
};

const mapIdToUnderscore = (arr) => arr.map(obj => {
  if (obj.id) {
    obj._id = obj.id;
    delete obj.id;
  }
  return obj;
});

const run = async () => {
  await connectDB();

  try {
    
    const users = mapIdToUnderscore(readJson('users.json'));
    if (users.length) {
      await User.insertMany(users, { ordered: false });
      console.log(`Imported ${users.length} users`);
    }

    const suppliers = mapIdToUnderscore(readJson('suppliers.json'));
    if (suppliers.length) {
      await Supplier.insertMany(suppliers, { ordered: false });
      console.log(`Imported ${suppliers.length} suppliers`);
    }

    const stores = mapIdToUnderscore(readJson('store.json'));
    if (stores.length) {
      await Store.insertMany(stores, { ordered: false });
      console.log(`Imported ${stores.length} stores`);
    }

    const products = mapIdToUnderscore(readJson('product.json'));
    if (products.length) {
      await Product.insertMany(products, { ordered: false });
      console.log(`Imported ${products.length} products`);
    }

    const orders = mapIdToUnderscore(readJson('order.json'));
    if (orders.length) {
      await Order.insertMany(orders, { ordered: false });
      console.log(`Imported ${orders.length} orders`);
    }

    const campaigns = mapIdToUnderscore(readJson('campaign.json'));
    if (campaigns.length) {
      await Campaign.insertMany(campaigns, { ordered: false });
      console.log(`Imported ${campaigns.length} campaigns`);
    }

    console.log('Migração concluída.');
    process.exit(0);
  } catch (err) {
    console.error('Erro na migração:', err);
    process.exit(1);
  }
};

run();
