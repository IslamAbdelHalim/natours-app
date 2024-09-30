const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASS,
);

async function connectDB() {
  try {
    await mongoose.connect(DB);
    console.log('Connected Successfully To DateBase');
  } catch (err) {
    console.log(err);
  }
}

module.exports = connectDB;
