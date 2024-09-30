const fs = require('fs');
require('dotenv').config({ path: '../config.env' });
const connectDB = require('./database/db');
const Tour = require('./models/Tour');

connectDB();

const tours = JSON.parse(
  fs.readFileSync('./dev-data/data/tours.json', 'utf-8'),
);

async function addAllTours() {
  try {
    await Tour.create(tours);
    console.log('all tours added');
  } catch (err) {
    console.log(err);
  }
  process.exit(1);
}

async function deleteAllTours() {
  try {
    await Tour.deleteMany({});
    console.log('all tours Deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit(1);
}

if (process.argv[2] === 'add-tours') {
  addAllTours();
} else if (process.argv[2] === 'delete-tours') {
  deleteAllTours();
}
