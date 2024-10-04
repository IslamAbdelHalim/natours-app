const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASS,
);

async function connectDB() {
  await mongoose.connect(DB);
  console.log('Connected Successfully To DateBase');
}

module.exports = connectDB;
